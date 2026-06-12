import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import DoctorProfile from '../../libs/components/mypage/DoctorProfile';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DoctorManage: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') return <h1>DOCTOR MANAGE MOBILE</h1>;

	return (
		<Stack sx={{ maxWidth: 800, margin: '0 auto', py: 5, px: 2 }}>
			<DoctorProfile />
		</Stack>
	);
};

export default withLayoutBasic(DoctorManage);
