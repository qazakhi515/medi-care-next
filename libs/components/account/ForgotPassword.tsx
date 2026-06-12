import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD, RESET_PASSWORD } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { Messages } from '../../config';

interface ForgotPasswordProps {
	onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
	const [step, setStep] = useState<number>(1);
	const [phone, setPhone] = useState<string>('');
	const [otp, setOtp] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [forgotPassword] = useMutation(FORGOT_PASSWORD);
	const [resetPassword] = useMutation(RESET_PASSWORD);

	/** HANDLERS **/
	const sendOtpHandler = async () => {
		try {
			if (!phone) throw new Error(Messages.error3);
			await forgotPassword({ variables: { input: { memberPhone: phone } } });
			await sweetMixinSuccessAlert('Verification code sent to your phone.');
			setStep(2);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const resetPasswordHandler = async () => {
		try {
			if (!otp || !newPassword) throw new Error(Messages.error3);
			if (newPassword.length < 5 || newPassword.length > 12) throw new Error('Password must be 5-12 characters!');
			await resetPassword({
				variables: { input: { memberPhone: phone, otpCode: otp, memberPassword: newPassword } },
			});
			await sweetMixinSuccessAlert('Password reset successfully! Please log in.');
			onBack();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<>
			<div className={'info'}>
				<span>reset</span>
				<p>Forgot your password? Reset it with a code sent to your phone.</p>
			</div>
			<div className={'input-wrap'}>
				{step === 1 ? (
					<div className={'input-box'}>
						<span>Phone</span>
						<input
							type="text"
							placeholder={'Enter your phone'}
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') sendOtpHandler();
							}}
						/>
					</div>
				) : (
					<>
						<div className={'input-box'}>
							<span>Verification code</span>
							<input
								type="text"
								placeholder={'Enter the code from SMS'}
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
						</div>
						<div className={'input-box'}>
							<span>New password</span>
							<input
								type="password"
								placeholder={'Enter new password (5-12 chars)'}
								minLength={5}
								maxLength={12}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								onKeyDown={(event) => {
									if (event.key === 'Enter') resetPasswordHandler();
								}}
							/>
						</div>
					</>
				)}
			</div>
			<div className={'register'}>
				{step === 1 ? (
					<button type="button" disabled={phone === ''} onClick={sendOtpHandler}>
						SEND CODE
						<img src="/img/icons/rightup.svg" alt="" />
					</button>
				) : (
					<button type="button" disabled={otp === '' || newPassword === ''} onClick={resetPasswordHandler}>
						RESET PASSWORD
						<img src="/img/icons/rightup.svg" alt="" />
					</button>
				)}
			</div>
			<div className={'ask-info'}>
				<p>
					Remembered it?
					<b onClick={onBack}> LOGIN</b>
				</p>
			</div>
		</>
	);
};

export default ForgotPassword;
