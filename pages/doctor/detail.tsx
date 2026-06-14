import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography, Chip, Button, Divider, Avatar } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { GET_DOCTOR, GET_DOCTOR_SCHEDULES, GET_HOSPITAL } from '../../apollo/user/query';
import { Doctor } from '../../libs/types/doctor/doctor';
import { Hospital } from '../../libs/types/hospital/hospital';
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

const cardStyle: React.CSSProperties = {
	background: '#fff',
	borderRadius: 16,
	padding: 28,
	border: '1px solid #e6e8df',
	boxShadow: '0 6px 20px rgba(47,51,39,0.06)',
};

const DoctorDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const doctorId = router.query?.id as string;
	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
	const [hospital, setHospital] = useState<Hospital | null>(null);

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

	/** current workplace — resolve the linked hospital (dynamic, no hardcoding) */
	useQuery(GET_HOSPITAL, {
		fetchPolicy: 'cache-and-network',
		variables: { input: doctor?.hospitalId },
		skip: !doctor?.hospitalId,
		onCompleted: (data: T) => setHospital(data?.getHospital ?? null),
	});

	const bookHandler = () => {
		router.push({ pathname: '/appointment', query: { doctorId } });
	};

	if (device === 'mobile') return <h1>DOCTOR DETAIL MOBILE</h1>;
	if (!doctor) return <Stack sx={{ minHeight: 400 }} />;

	const imagePath = doctor?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${doctor?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const fullName = doctor?.memberData?.memberFullName || doctor?.memberData?.memberNick || 'Doctor';
	const bio = doctor?.memberData?.memberDesc?.trim();
	const hasEducation = Boolean(doctor?.education?.trim() || doctor?.certificates?.trim());

	return (
		<div style={{ background: 'linear-gradient(180deg, #f6f7f3 0%, #eef0e9 100%)', padding: '40px 0' }}>
			<Stack sx={{ maxWidth: 1000, margin: '0 auto', px: 2 }} spacing={4}>
				{/* 1. Doctor Introduction */}
				<div style={cardStyle}>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={4}
						alignItems={{ xs: 'flex-start', sm: 'center' }}
					>
						<Box
							component={motion.div}
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}
							whileHover={{ scale: 1.03 }}
							sx={{ borderRadius: '14px', flexShrink: 0 }}
						>
							<Avatar src={imagePath} sx={{ width: 170, height: 170, borderRadius: '14px' }} variant="rounded" />
						</Box>
						<Stack spacing={1.5} sx={{ flex: 1 }}>
							<Typography variant="h4" sx={{ fontWeight: 700, color: '#2f3327' }}>
								{fullName}
							</Typography>
							<Stack direction="row" spacing={1}>
								<Chip label={doctor?.specialization} sx={{ background: '#6b7256', color: '#fff' }} />
								<Chip label={doctor?.doctorStatus} variant="outlined" />
							</Stack>
							{bio && <Typography sx={{ color: '#3f4536', lineHeight: 1.7 }}>{bio}</Typography>}
							{doctor?.experienceYears ? (
								<Typography color="text.secondary">Experience: {doctor.experienceYears} years</Typography>
							) : null}
							<Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: '#2f3327' }}>
								Consultation fee: {formatterStr(doctor?.consultationFee)} sum
							</Typography>
							<Button
								variant="contained"
								size="large"
								sx={{ width: 'fit-content', mt: 1, background: '#6b7256', '&:hover': { background: '#4f5641' } }}
								onClick={bookHandler}
							>
								Book appointment
							</Button>
						</Stack>
					</Stack>
				</div>

				{/* 2. Education */}
				<div style={cardStyle}>
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
						<SchoolOutlinedIcon sx={{ color: '#6b7256' }} />
						<Typography variant="h5" sx={{ fontWeight: 700, color: '#2f3327' }}>
							Education
						</Typography>
					</Stack>
					<Divider sx={{ mb: 2 }} />
					{hasEducation ? (
						<Stack spacing={1.2}>
							{doctor?.education?.trim() && (
								<Typography sx={{ color: '#3f4536', lineHeight: 1.7 }}>{doctor.education}</Typography>
							)}
							{doctor?.certificates?.trim() && (
								<Typography color="text.secondary">Certificates: {doctor.certificates}</Typography>
							)}
							<Typography color="text.secondary">License: {doctor?.licenseNumber}</Typography>
						</Stack>
					) : (
						<Typography color="text.secondary">No education details provided yet.</Typography>
					)}
				</div>

				{/* 3. Work Experience */}
				<div style={cardStyle}>
					<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
						<WorkOutlineOutlinedIcon sx={{ color: '#6b7256' }} />
						<Typography variant="h5" sx={{ fontWeight: 700, color: '#2f3327' }}>
							Work Experience
						</Typography>
					</Stack>
					<Divider sx={{ mb: 2 }} />
					<Stack spacing={1.2}>
						<Typography color="text.secondary">
							{doctor?.experienceYears
								? `${doctor.experienceYears} years of medical practice`
								: 'Experience information not provided yet.'}
						</Typography>
						{hospital ? (
							<Stack direction="row" spacing={1} alignItems="center">
								<LocalHospitalOutlinedIcon sx={{ color: '#8a9a7b', fontSize: 20 }} />
								<Typography sx={{ color: '#3f4536' }}>
									Currently at <strong>{hospital.hospitalTitle}</strong>
									{hospital.hospitalLocation ? ` — ${hospital.hospitalLocation}` : ''}
								</Typography>
							</Stack>
						) : (
							<Typography color="text.disabled">Current workplace not specified.</Typography>
						)}
					</Stack>
				</div>

				{/* Weekly Availability (existing functionality, preserved) */}
				<div style={cardStyle}>
					<Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#2f3327' }}>
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
				</div>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(DoctorDetail);
