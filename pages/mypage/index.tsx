import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyHospitals from '../../libs/components/mypage/MyHospitals';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddHospital from '../../libs/components/mypage/AddNewHospital';
import DoctorProfile from '../../libs/components/mypage/DoctorProfile';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetConfirmAlert, sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { logOut } from '../../libs/auth';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	/** LIFECYCLES **/
	useEffect(() => {
		if (!user._id) router.push('/').then();
	}, [user]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			console.log('id: ', id);
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		const logoutHandler = async () => {
			try {
				if (await sweetConfirmAlert('Do you want to logout?')) logOut();
			} catch (err: any) {
				console.log('ERROR, logoutHandler:', err.message);
			}
		};

		if (!user?._id) {
			return (
				<div id="my-page" className="mobile">
					<div className="m-login-gate">
						<p className="m-gate-title">Please log in</p>
						<p className="m-gate-sub">Log in to view your profile, appointments and favorites.</p>
						<button type="button" className="m-gate-btn" onClick={() => router.push('/account/join')}>
							Log in
						</button>
					</div>
				</div>
			);
		}

		const memberImage = user?.memberImage
			? `${REACT_APP_API_URL}/${user?.memberImage}`
			: '/img/profile/defaultUser.svg';
		const displayName = user?.memberFullName || user?.memberNick || 'Member';

		const quickActions = [
			{ label: 'Appointments', sub: 'Your visits', href: '/appointment', icon: <CalendarMonthOutlinedIcon /> },
			{ label: 'Hospitals', sub: 'Browse', href: '/hospital', icon: <LocalHospitalOutlinedIcon /> },
			{ label: 'Doctors', sub: 'Find a doctor', href: '/doctor', icon: <MedicalServicesOutlinedIcon /> },
			{ label: 'Community', sub: 'Read & post', href: '/community', icon: <ForumOutlinedIcon /> },
		];

		const accountLinks = [
			{ label: 'Edit Profile', href: '/mypage?category=myProfile', icon: <SettingsOutlinedIcon /> },
			{ label: 'My Favorites', href: '/mypage?category=myFavorites', icon: <FavoriteBorderIcon /> },
			{ label: 'My Articles', href: '/mypage?category=myArticles', icon: <ArticleOutlinedIcon /> },
		];

		return (
			<div id="my-page" className="mobile">
				<div className="m-profile">
					<img className="m-avatar" src={memberImage} alt={displayName} />
					<div className="m-profile-info">
						<p className="m-name">{displayName}</p>
						{user?.memberType ? <span className="m-type">{user.memberType}</span> : null}
						{user?.memberPhone ? <span className="m-phone">{user.memberPhone}</span> : null}
					</div>
				</div>

				<div className="m-stats">
					<div className="m-stat">
						<b>{user?.memberHospitals ?? 0}</b>
						<span>Hospitals</span>
					</div>
					<div className="m-stat">
						<b>{user?.memberArticles ?? 0}</b>
						<span>Articles</span>
					</div>
					<div className="m-stat">
						<b>{user?.memberLikes ?? 0}</b>
						<span>Likes</span>
					</div>
				</div>

				<p className="m-section-title">Quick actions</p>
				<div className="m-actions">
					{quickActions.map((a) => (
						<div className="m-action" key={a.label} onClick={() => router.push(a.href)}>
							<span className="m-action-icon">{a.icon}</span>
							<span className="m-action-label">{a.label}</span>
							<span className="m-action-sub">{a.sub}</span>
						</div>
					))}
				</div>

				<p className="m-section-title">Account</p>
				<div className="m-list">
					{accountLinks.map((l) => (
						<div className="m-row" key={l.label} onClick={() => router.push(l.href)}>
							<span className="m-row-icon">{l.icon}</span>
							<span className="m-row-label">{l.label}</span>
							<ChevronRightIcon className="m-row-arrow" />
						</div>
					))}
					<div className="m-row m-logout" onClick={logoutHandler}>
						<span className="m-row-icon">
							<LogoutIcon />
						</span>
						<span className="m-row-label">Logout</span>
						<ChevronRightIcon className="m-row-arrow" />
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div id="my-page" style={{ position: 'relative' }}>
				<div className="container">
					<Stack className={'my-page'}>
						<Stack className={'back-frame'}>
							<Stack className={'left-config'}>
								<MyMenu />
							</Stack>
							<Stack className="main-config" mb={'76px'}>
								<Stack className={'list-config'}>
									{category === 'addHospital' && <AddHospital />}
									{category === 'doctorProfile' && <DoctorProfile />}
									{category === 'myHospitals' && <MyHospitals />}
									{category === 'myFavorites' && <MyFavorites />}
									{category === 'recentlyVisited' && <RecentlyVisited />}
									{category === 'myArticles' && <MyArticles />}
									{category === 'writeArticle' && <WriteArticle />}
									{category === 'myProfile' && <MyProfile />}
									{category === 'followers' && (
										<MemberFollowers
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
									{category === 'followings' && (
										<MemberFollowings
											subscribeHandler={subscribeHandler}
											unsubscribeHandler={unsubscribeHandler}
											likeMemberHandler={likeMemberHandler}
											redirectToMemberPageHandler={redirectToMemberPageHandler}
										/>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

export default withLayoutBasic(MyPage);
