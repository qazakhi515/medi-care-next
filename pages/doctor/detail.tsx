import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography, Chip, Button, Divider, Avatar } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { GET_DOCTOR, GET_DOCTOR_SCHEDULES } from '../../apollo/user/query';
import { Doctor } from '../../libs/types/doctor/doctor';
import { DoctorSchedule } from '../../libs/types/doctor-schedule/doctor-schedule';
import { DayOfWeek } from '../../libs/enums/schedule.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DoctorDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const doctorId = router.query?.id as string;
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

	/** APOLLO REQUESTS **/
	useQuery(GET_DOCTOR, {
		fetchPolicy: 'network-only',
		variables: { input: doctorId },
		skip: !doctorId,
		onCompleted: (data: T) => setDoctor(data?.getDoctor),
	});

	useQuery(GET_DOCTOR_SCHEDULES, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50, search: { doctorId } } },
		skip: !doctorId,
		onCompleted: (data: T) => setSchedules(data?.getDoctorSchedules?.list ?? []),
	});

	const bookHandler = () => {
		router.push({ pathname: '/appointment', query: { doctorId } });
	};

	if (device === 'mobile') return <h1>DOCTOR DETAIL MOBILE</h1>;
	if (!doctor) return <Stack sx={{ minHeight: 400 }} />;

	const imagePath = doctor?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${doctor?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<Stack sx={{ maxWidth: 1000, margin: '0 auto', py: 5, px: 2 }}>
			<Stack direction="row" spacing={4} sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
				<Avatar src={imagePath} sx={{ width: 160, height: 160, borderRadius: '12px' }} variant="rounded" />
				<Stack spacing={1.5} sx={{ flex: 1 }}>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{doctor?.memberData?.memberFullName || doctor?.memberData?.memberNick || 'Doctor'}
					</Typography>
					<Stack direction="row" spacing={1}>
						<Chip label={doctor?.specialization} color="primary" />
						<Chip label={doctor?.doctorStatus} variant="outlined" />
					</Stack>
					<Typography color="text.secondary">License: {doctor?.licenseNumber}</Typography>
					<Typography color="text.secondary">Experience: {doctor?.experienceYears ?? 0} years</Typography>
					{doctor?.education && <Typography color="text.secondary">Education: {doctor?.education}</Typography>}
					{doctor?.certificates && <Typography color="text.secondary">Certificates: {doctor?.certificates}</Typography>}
					<Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
						Consultation fee: ${formatterStr(doctor?.consultationFee)}
					</Typography>
					<Button variant="contained" size="large" sx={{ width: 'fit-content', mt: 1 }} onClick={bookHandler}>
						Book appointment
					</Button>
				</Stack>
			</Stack>

			<Stack sx={{ mt: 4, background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
					Weekly Availability
				</Typography>
				<Divider sx={{ mb: 2 }} />
				{schedules.length === 0 ? (
					<Typography color="text.secondary">No schedule published yet.</Typography>
				) : (
					<Stack spacing={1}>
						{Object.values(DayOfWeek).map((day) => {
							const daySchedules = schedules.filter((s) => s.dayOfWeek === day);
							return (
								<Stack key={day} direction="row" spacing={2} alignItems="center">
									<Typography sx={{ width: 120, fontWeight: 600 }}>{day}</Typography>
									{daySchedules.length === 0 ? (
										<Typography color="text.disabled">Closed</Typography>
									) : (
										daySchedules.map((s) => (
											<Chip key={s._id} label={`${s.startTime} - ${s.endTime} (${s.slotDuration}m)`} variant="outlined" />
										))
									)}
								</Stack>
							);
						})}
					</Stack>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(DoctorDetail);
