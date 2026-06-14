import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { ASK_MEDICAL_AI } from '../../apollo/user/mutation';
import { MedicalAiAnswer } from '../../libs/types/medical-ai/medical-ai';
import { MedicalAiUrgencyLevel } from '../../libs/enums/medical-ai.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { userVar } from '../../apollo/store';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

type ChatItem = { role: 'user'; text: string } | { role: 'ai'; data: MedicalAiAnswer };

const EXAMPLE_QUESTIONS = [
	'I have a sore throat and mild fever for two days.',
	'My child has a rash on the arms — what should I do?',
	'I feel chest tightness when climbing stairs.',
	'What does persistent headache in the mornings mean?',
];

const urgencyMeta = (level: MedicalAiUrgencyLevel): { label: string; cls: string } => {
	switch (level) {
		case MedicalAiUrgencyLevel.EMERGENCY:
			return { label: 'Emergency', cls: 'u-emergency' };
		case MedicalAiUrgencyLevel.HIGH:
			return { label: 'High urgency', cls: 'u-high' };
		case MedicalAiUrgencyLevel.MEDIUM:
			return { label: 'Medium', cls: 'u-medium' };
		default:
			return { label: 'Low', cls: 'u-low' };
	}
};

const AiChatPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const [messages, setMessages] = useState<ChatItem[]>([]);
	const [input, setInput] = useState<string>('');
	const bottomRef = useRef<HTMLDivElement | null>(null);

	const [askMedicalAi, { loading }] = useMutation(ASK_MEDICAL_AI);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, loading]);

	/** HANDLERS **/
	const sendHandler = async () => {
		const message = input.trim();
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (user?.memberType !== MemberType.PATIENT) throw new Error('This assistant is available to patients only.');
			if (message.length < 3) throw new Error('Please enter at least 3 characters.');

			setMessages((prev) => [...prev, { role: 'user', text: message }]);
			setInput('');

			const res = await askMedicalAi({
				variables: { input: { message, language: router.locale ?? 'en' } },
			});
			const data: MedicalAiAnswer | undefined = res?.data?.askMedicalAi;
			if (data) setMessages((prev) => [...prev, { role: 'ai', data }]);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const exampleHandler = (q: string) => setInput(q);
	const goToDoctors = () => router.push('/doctor');
	const goToBooking = () => router.push('/appointment');

	if (device === 'mobile') return <h1>AI ASSISTANT MOBILE</h1>;

	/** AUTH GATE **/
	if (!user?._id) {
		return (
			<div className="ai-gate">
				<p>Please log in to use the Medical AI Assistant.</p>
				<button type="button" onClick={() => router.push('/account/join')}>
					Login / Register
				</button>
				<style jsx>{gateStyles}</style>
			</div>
		);
	}
	if (user?.memberType !== MemberType.PATIENT) {
		return (
			<div className="ai-gate">
				<p>The Medical AI Assistant is available to patients only.</p>
				<style jsx>{gateStyles}</style>
			</div>
		);
	}

	return (
		<div className="ai-page">
			<div className="ai-container">
				<div className="ai-head">
					<h1>Medical AI Assistant</h1>
					<p>Ask about symptoms and get safe general guidance. This is not a medical diagnosis.</p>
				</div>

				<div className="ai-transcript">
					{messages.length === 0 && (
						<div className="ai-empty">
							<p className="empty-title">Try asking…</p>
							<div className="example-grid">
								{EXAMPLE_QUESTIONS.map((q) => (
									<button key={q} type="button" className="example" onClick={() => exampleHandler(q)}>
										{q}
									</button>
								))}
							</div>
						</div>
					)}

					{messages.map((m, idx) =>
						m.role === 'user' ? (
							<div key={idx} className="bubble user">
								{m.text}
							</div>
						) : (
							<div key={idx} className="ai-card">
								<div className={`urgency ${urgencyMeta(m.data.urgencyLevel).cls}`}>
									{urgencyMeta(m.data.urgencyLevel).label}
								</div>

								{m.data.urgencyLevel === MedicalAiUrgencyLevel.EMERGENCY && (
									<div className="emergency-banner">
										⚠ This may be an emergency. If symptoms are severe, call emergency services or go to the
										nearest emergency department immediately.
									</div>
								)}

								<p className="answer">{m.data.answer}</p>

								<div className="ai-actions">
									{m.data.suggestedSpecialization && (
										<button type="button" className="spec-chip" onClick={goToDoctors}>
											See {m.data.suggestedSpecialization} doctors
										</button>
									)}
									{(m.data.shouldBookAppointment || m.data.urgencyLevel === MedicalAiUrgencyLevel.HIGH) && (
										<button type="button" className="book-btn" onClick={goToBooking}>
											Book Appointment
										</button>
									)}
								</div>

								<p className="safety">{m.data.safetyNotice}</p>
							</div>
						),
					)}

					{loading && <div className="bubble ai-typing">Assistant is thinking…</div>}
					<div ref={bottomRef} />
				</div>

				<div className="ai-input-bar">
					<input
						type="text"
						placeholder="Describe your symptoms…"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !loading) sendHandler();
						}}
					/>
					<button type="button" onClick={sendHandler} disabled={loading || input.trim().length < 3}>
						{loading ? '…' : 'Send'}
					</button>
				</div>
			</div>

			<style jsx>{`
				.ai-page {
					padding: 40px 16px 80px;
				}
				.ai-container {
					max-width: 760px;
					margin: 0 auto;
					display: flex;
					flex-direction: column;
					gap: 18px;
				}
				.ai-head h1 {
					margin: 0;
					font-size: 26px;
					font-weight: 800;
					color: #181a20;
				}
				.ai-head p {
					margin: 6px 0 0;
					font-size: 14px;
					color: #6b7280;
				}
				.ai-transcript {
					display: flex;
					flex-direction: column;
					gap: 14px;
					min-height: 340px;
					max-height: 60vh;
					overflow-y: auto;
					padding: 20px;
					background: #f7f9fc;
					border-radius: 14px;
				}
				.ai-empty {
					margin: auto 0;
					text-align: center;
				}
				.empty-title {
					font-size: 14px;
					color: #8a93a6;
					margin-bottom: 14px;
				}
				.example-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 10px;
				}
				.example {
					text-align: left;
					padding: 12px 14px;
					border: 1px solid #e2e7f0;
					border-radius: 10px;
					background: #fff;
					color: #303a4d;
					font-size: 13px;
					cursor: pointer;
					transition: border-color 0.15s ease, transform 0.15s ease;
				}
				.example:hover {
					border-color: #2a6cdf;
					transform: translateY(-2px);
				}
				.bubble {
					max-width: 80%;
					padding: 12px 16px;
					border-radius: 14px;
					font-size: 14px;
					line-height: 1.5;
				}
				.bubble.user {
					align-self: flex-end;
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					color: #fff;
					border-bottom-right-radius: 4px;
				}
				.ai-typing {
					align-self: flex-start;
					background: #fff;
					color: #8a93a6;
					border: 1px solid #eef1f6;
				}
				.ai-card {
					align-self: flex-start;
					max-width: 92%;
					background: #fff;
					border: 1px solid #eef1f6;
					border-radius: 14px;
					border-bottom-left-radius: 4px;
					padding: 16px 18px;
					display: flex;
					flex-direction: column;
					gap: 10px;
					box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
				}
				.urgency {
					align-self: flex-start;
					padding: 3px 12px;
					border-radius: 20px;
					font-size: 11px;
					font-weight: 700;
					letter-spacing: 0.4px;
					text-transform: uppercase;
				}
				.u-low {
					background: #e7f6ec;
					color: #1f8b4c;
				}
				.u-medium {
					background: #fff4e0;
					color: #b9770a;
				}
				.u-high {
					background: #ffe8e0;
					color: #d3491b;
				}
				.u-emergency {
					background: #d3291b;
					color: #fff;
				}
				.emergency-banner {
					background: #fff0ed;
					border: 1px solid #f3b5a6;
					color: #b3260f;
					padding: 12px 14px;
					border-radius: 10px;
					font-size: 13px;
					font-weight: 600;
					line-height: 1.5;
				}
				.answer {
					margin: 0;
					font-size: 14.5px;
					line-height: 1.6;
					color: #1f2733;
					white-space: pre-wrap;
				}
				.ai-actions {
					display: flex;
					flex-wrap: wrap;
					gap: 10px;
				}
				.spec-chip {
					padding: 7px 14px;
					border-radius: 20px;
					border: 1px solid #2a6cdf;
					background: #eef4ff;
					color: #1c4fb3;
					font-size: 13px;
					font-weight: 600;
					cursor: pointer;
				}
				.spec-chip:hover {
					background: #dfeaff;
				}
				.book-btn {
					padding: 7px 16px;
					border-radius: 20px;
					border: none;
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					color: #fff;
					font-size: 13px;
					font-weight: 600;
					cursor: pointer;
				}
				.book-btn:hover {
					box-shadow: 0 6px 16px rgba(28, 79, 179, 0.32);
				}
				.safety {
					margin: 0;
					font-size: 11.5px;
					color: #9aa3b2;
					line-height: 1.5;
					border-top: 1px solid #f0f2f6;
					padding-top: 8px;
				}
				.ai-input-bar {
					display: flex;
					gap: 10px;
					align-items: center;
				}
				.ai-input-bar input {
					flex: 1;
					height: 50px;
					padding: 0 16px;
					border: 1px solid #d7dce5;
					border-radius: 12px;
					font-size: 14px;
					font-family: inherit;
				}
				.ai-input-bar input:focus {
					outline: none;
					border-color: #2a6cdf;
				}
				.ai-input-bar button {
					height: 50px;
					padding: 0 26px;
					border: none;
					border-radius: 12px;
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					color: #fff;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: opacity 0.15s ease;
				}
				.ai-input-bar button:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			`}</style>
		</div>
	);
};

const gateStyles = `
	.ai-gate {
		max-width: 520px;
		margin: 80px auto;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	.ai-gate p {
		font-size: 16px;
		color: #6b7280;
	}
	.ai-gate button {
		padding: 12px 24px;
		border: none;
		border-radius: 10px;
		background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
		color: #fff;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}
`;

export default withLayoutBasic(AiChatPage);
