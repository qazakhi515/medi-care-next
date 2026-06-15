import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import ForgotPassword from '../../libs/components/account/ForgotPassword';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LOGIN_BG_IMAGES = ['/img/banner/slyle2.jpg', '/img/banner/style3.jpg', '/img/banner/rasm4.jpg'];

const Join: NextPage = () => {
	const router = useRouter();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'PATIENT' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [forgotView, setForgotView] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [bgIndex, setBgIndex] = useState<number>(0);

	/** Fon rasmlari uzluksiz birin-ketin almashadi (slayd-shou) **/
	useEffect(() => {
		const intervalId = setInterval(() => {
			setBgIndex((prev) => (prev + 1) % LOGIN_BG_IMAGES.length);
		}, 4000);
		return () => clearInterval(intervalId);
	}, []);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'PATIENT');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	/** Telefon raqami: faqat raqamlar va boshida ixtiyoriy "+" belgisi kiritiladi (harf/belgi bloklanadi) **/
	const handlePhoneInput = useCallback(
		(value: string) => {
			let sanitized = value.replace(/[^\d+]/g, '');
			// "+" faqat boshida bir marta bo'lishi mumkin
			sanitized = sanitized.replace(/(?!^)\+/g, '');
			handleInput('phone', sanitized);
		},
		[handleInput],
	);

	/** To'g'ri format: ixtiyoriy "+", keyin 7–15 ta raqam **/
	const isValidPhone = (phone: string) => /^\+?\d{7,15}$/.test(phone);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			if (!isValidPhone(input.phone)) {
				throw new Error('Please enter a valid phone number (7–15 digits, optional leading +).');
			}
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	{
		return (
			<Stack className={'join-page'}>
				<Stack className={'container'}>
					<Stack className={'main'}>
						<Stack className={'left'}>
							{/* @ts-ignore */}
							<Box className={'logo'}>
								<img src="/img/logo/logo.png" alt="MEDI-CARE" />
							</Box>
							{forgotView ? (
								<ForgotPassword onBack={() => setForgotView(false)} />
							) : (
								<>
									<Box className={'info'}>
										<span>{loginView ? 'login' : 'signup'}</span>
										<p>{loginView ? 'Login' : 'Sign'} in with this account across the following sites.</p>
									</Box>
									<Box className={'input-wrap'}>
										<div className={'input-box'}>
											<span>Nickname</span>
											<input
												type="text"
												placeholder={'Enter Nickname'}
												minLength={3}
												maxLength={12}
												autoComplete="off"
												onChange={(e) => handleInput('nick', e.target.value)}
												required={true}
												onKeyDown={(event) => {
													if (event.key == 'Enter' && loginView) doLogin();
													if (event.key == 'Enter' && !loginView) doSignUp();
												}}
											/>
										</div>
										<div className={'input-box'}>
											<span>Password</span>
											<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
												<input
													type={showPassword ? 'text' : 'password'}
													placeholder={'Enter Password'}
													minLength={5}
													maxLength={12}
													autoComplete="new-password"
													onChange={(e) => handleInput('password', e.target.value)}
													required={true}
													onKeyDown={(event) => {
														if (event.key == 'Enter' && loginView) doLogin();
														if (event.key == 'Enter' && !loginView) doSignUp();
													}}
													style={{ paddingRight: 44 }}
												/>
												<span
													onClick={() => setShowPassword((prev) => !prev)}
													style={{
														position: 'absolute',
														right: 14,
														display: 'flex',
														alignItems: 'center',
														cursor: 'pointer',
														color: '#717171',
														marginBottom: 0,
													}}
												>
													{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
												</span>
											</div>
										</div>
										{!loginView && (
											<div className={'input-box'}>
												<span>Phone</span>
												<input
													type="tel"
													inputMode="tel"
													placeholder={'Enter Phone'}
													value={input.phone}
													onChange={(e) => handlePhoneInput(e.target.value)}
													required={true}
													onKeyDown={(event) => {
														if (event.key == 'Enter') doSignUp();
													}}
												/>
											</div>
										)}
									</Box>
									<Box className={'register'}>
										{!loginView && (
											<div className={'type-option'}>
												<span className={'text'}>I want to be registered as:</span>
												<div>
													<FormGroup>
														<FormControlLabel
															control={
																<Checkbox
																	size="small"
																	name={'PATIENT'}
																	onChange={checkUserTypeHandler}
																	checked={input?.type == 'PATIENT'}
																/>
															}
															label="Patient"
														/>
													</FormGroup>
													<FormGroup>
														<FormControlLabel
															control={
																<Checkbox
																	size="small"
																	name={'DOCTOR'}
																	onChange={checkUserTypeHandler}
																	checked={input?.type == 'DOCTOR'}
																/>
															}
															label="Doctor"
														/>
													</FormGroup>
												</div>
											</div>
										)}

										{loginView && (
											<div className={'remember-info'}>
												<FormGroup>
													<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
												</FormGroup>
												<a style={{ cursor: 'pointer' }} onClick={() => setForgotView(true)}>
													Lost your password?
												</a>
											</div>
										)}

										{loginView ? (
											<Button
												variant="contained"
												endIcon={<img src="/img/icons/rightup.svg" alt="" />}
												disabled={input.nick == '' || input.password == ''}
												onClick={doLogin}
											>
												LOGIN
											</Button>
										) : (
											<Button
												variant="contained"
												disabled={
													input.nick == '' || input.password == '' || !isValidPhone(input.phone) || input.type == ''
												}
												onClick={doSignUp}
												endIcon={<img src="/img/icons/rightup.svg" alt="" />}
											>
												SIGNUP
											</Button>
										)}
									</Box>
									<Box className={'ask-info'}>
										{loginView ? (
											<p>
												Not registered yet?
												<b
													onClick={() => {
														viewChangeHandler(false);
													}}
												>
													SIGNUP
												</b>
											</p>
										) : (
											<p>
												Have account?
												<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
											</p>
										)}
									</Box>
								</>
							)}
						</Stack>
						<Stack
							className={'right'}
							style={{ backgroundImage: `url(${LOGIN_BG_IMAGES[bgIndex]})`, backgroundPosition: 'center' }}
						></Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
