import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { UPDATE_NOTIFICATION } from '../../apollo/user/mutation';
import { NotificationStatus } from '../enums/notification.enum';
import { Notification } from '../types/notification/notification';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		top: '109px',
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 160,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
			},
		},
	},
}));

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [notifOpen, setNotifOpen] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	/** NOTIFICATIONS **/
	const { refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50 } },
		skip: !user?._id,
		onCompleted: (data: any) => setNotifications(data?.getNotifications?.list ?? []),
	});
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const unreadCount = notifications.filter((n) => n.notificationStatus === NotificationStatus.WAIT).length;

	const markNotificationReadHandler = async (notif: Notification) => {
		try {
			if (notif.notificationStatus !== NotificationStatus.WAIT) return;
			await updateNotification({
				variables: { input: { _id: notif._id, notificationStatus: NotificationStatus.READ } },
			});
			await refetchNotifications();
		} catch (err: any) {
			console.log('Error, markNotificationReadHandler:', err.message);
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/hospital/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', changeNavbarColor);
		return () => window.removeEventListener('scroll', changeNavbarColor);
	}, []);

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/hospital'}>
					<div>{t('Hospitals')}</div>
				</Link>
				<Link href={'/doctor'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/appointment'}>
					<div> Appointments </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/logoWhite.png" alt="MEDI-CARE" />
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div>{t('Home')}</div>
							</Link>
							<Link href={'/hospital'}>
								<div>{t('Hospitals')}</div>
							</Link>
							<Link href={'/doctor'}>
								<div> {t('Agents')} </div>
							</Link>
							<Link href={'/appointment'}>
								<div> Appointments </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div> {t('Community')} </div>
							</Link>
							{user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)}
							<Link href={'/cs'}>
								<div> {t('CS')} </div>
							</Link>
						</Box>
						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											Logout
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<AccountCircleOutlinedIcon />
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && (
									<div style={{ position: 'relative', display: 'inline-flex' }}>
										<NotificationsOutlinedIcon
											className={'notification-icon'}
											style={{ cursor: 'pointer' }}
											onClick={() => setNotifOpen((prev) => !prev)}
										/>
										{unreadCount > 0 && (
											<span
												style={{
													position: 'absolute',
													top: -6,
													right: -6,
													minWidth: 16,
													height: 16,
													padding: '0 4px',
													borderRadius: 8,
													background: '#eb6753',
													color: '#fff',
													fontSize: 10,
													fontWeight: 700,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{unreadCount}
											</span>
										)}
										{notifOpen && (
											<div
												style={{
													position: 'absolute',
													top: 34,
													right: 0,
													width: 320,
													maxHeight: 400,
													overflowY: 'auto',
													background: '#fff',
													borderRadius: 10,
													boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
													zIndex: 1000,
													padding: 8,
												}}
											>
												<div style={{ padding: '8px 10px', fontWeight: 700, fontSize: 14, borderBottom: '1px solid #eee' }}>
													Notifications
												</div>
												{notifications.length === 0 ? (
													<div style={{ padding: 16, color: '#888', fontSize: 13, textAlign: 'center' }}>
														No notifications
													</div>
												) : (
													notifications.map((n) => (
														<div
															key={n._id}
															onClick={() => markNotificationReadHandler(n)}
															style={{
																padding: 10,
																borderRadius: 8,
																cursor: 'pointer',
																background:
																	n.notificationStatus === NotificationStatus.WAIT ? '#f4f8ff' : 'transparent',
															}}
														>
															<div style={{ fontWeight: 600, fontSize: 13, color: '#181a20' }}>
																{n.notificationTitle}
															</div>
															{n.notificationDesc && (
																<div style={{ fontSize: 12, color: '#717171', marginTop: 2 }}>
																	{n.notificationDesc}
																</div>
															)}
														</div>
													))
												)}
											</div>
										)}
									</div>
								)}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/>
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
