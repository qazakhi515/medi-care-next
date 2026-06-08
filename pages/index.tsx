import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import QuickNav from '../libs/components/homepage/QuickNav';
import PopularHospitals from '../libs/components/homepage/PopularHospitals';
import FamousDoctors from '../libs/components/homepage/FamousDoctors';
import AppointmentCTA from '../libs/components/homepage/AppointmentCTA';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<QuickNav />
				<PopularHospitals />
				<FamousDoctors />
				<AppointmentCTA />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<QuickNav />
				<PopularHospitals />
				<FamousDoctors />
				<AppointmentCTA />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
