import React from 'react';
import { useRouter } from 'next/router';

/**
 * Floating "Dr. AI" button — sits just above the live-chat widget (bottom-right)
 * and routes to the Medical AI assistant page. Uses an inline robot SVG so it
 * always renders (no external image dependency).
 */
const DrAiButton = () => {
	const router = useRouter();

	return (
		<>
			<button type="button" className="dr-ai-fab" title="Dr. AI Assistant" onClick={() => router.push('/ai-chat')}>
				<svg className="dr-ai-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* antenna */}
					<circle cx="12" cy="3" r="1.4" fill="#ffffff" />
					<rect x="11.4" y="4" width="1.2" height="2.6" rx="0.6" fill="#ffffff" />
					{/* ears */}
					<rect x="3" y="10" width="1.8" height="4" rx="0.9" fill="#ffffff" />
					<rect x="19.2" y="10" width="1.8" height="4" rx="0.9" fill="#ffffff" />
					{/* head */}
					<rect x="5" y="6.4" width="14" height="11.2" rx="3.6" fill="#ffffff" />
					{/* eyes */}
					<circle cx="9.4" cy="11.4" r="1.6" fill="#1c4fb3" />
					<circle cx="14.6" cy="11.4" r="1.6" fill="#1c4fb3" />
					{/* eye shine */}
					<circle cx="9" cy="10.9" r="0.5" fill="#ffffff" />
					<circle cx="14.2" cy="10.9" r="0.5" fill="#ffffff" />
					{/* mouth */}
					<rect x="8.8" y="14.4" width="6.4" height="1.5" rx="0.75" fill="#1c4fb3" />
				</svg>
				<span className="dr-ai-badge">AI</span>
			</button>
			<style jsx>{`
				.dr-ai-fab {
					position: fixed;
					right: 30px;
					bottom: 150px;
					z-index: 999;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 56px;
					height: 56px;
					padding: 0;
					border: none;
					border-radius: 50%;
					background: linear-gradient(135deg, #2a6cdf 0%, #1c4fb3 100%);
					box-shadow: 0px 0px 12px 0px rgba(28, 79, 179, 0.35);
					cursor: pointer;
					transition: transform 0.25s ease, box-shadow 0.25s ease;
				}
				.dr-ai-fab:hover {
					transform: scale(1.08);
					box-shadow: 0 6px 20px rgba(28, 79, 179, 0.5);
				}
				.dr-ai-svg {
					width: 34px;
					height: 34px;
				}
				.dr-ai-badge {
					position: absolute;
					right: -2px;
					bottom: -2px;
					background: #fff;
					color: #1c4fb3;
					font-size: 9px;
					font-weight: 800;
					letter-spacing: 0.3px;
					padding: 2px 5px;
					border-radius: 10px;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
				}
			`}</style>
		</>
	);
};

export default DrAiButton;
