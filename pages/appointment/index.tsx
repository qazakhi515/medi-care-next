import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography, Button, TextField, Divider, Chip } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { GET_APPOINTMENTS, GET_DOCTOR, GET_DOCTOR_SCHEDULES } from '../../apollo/user/query';
import { CREATE_APPOINTMENT } from '../../apollo/user/mutation';
import SlotPicker, { generateSlots, Slot } from '../../libs/components/appointment/SlotPicker';
import { Appointment } from '../../libs/types/appointment/appointment';
import { Doctor } from '../../libs/types/doctor/doctor';
import { DoctorSchedule } from '../../libs/types/doctor-schedule/doctor-schedule';
import { userVar } from '../../apollo/store';
import { MemberType } from '../../libs/enums/member.enum';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AppointmentPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const doctorId = router.query?.doctorId as string;

	const [doctor, setDoctor] = useState<Doctor | null>(null);
	const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [date, setDate] = useState<string>('');
	const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
	const [symptoms, setSymptoms] = useState<string>('');
	const [reason, setReason] = useState<string>('');

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

	const { refetch: refetchAppointments } = useQuery(GET_APPOINTMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50, sort: 'appointmentDate', direction: 'DESC', search: {} } },
		skip: !user?._id,
		onCompleted: (data: T) => setAppointments(data?.getAppointments?.list ?? []),
	});

	const [createAppointment] = useMutation(CREATE_APPOINTMENT);

	const slots = generateSlots(schedules, date);

	/** HANDLERS **/
	const bookHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (user?.memberType !== MemberType.PATIENT) throw new Error('Only patients can book appointments');
			if (!doctorId || !date || !selectedSlot) throw new Error(Messages.error3);

			await createAppointment({
				variables: {
					input: {
						doctorId,
						appointmentDate: new Date(date),
						startTime: selectedSlot.startTime,
						endTime: selectedSlot.endTime,
						symptoms: symptoms || undefined,
						appointmentReason: reason || undefined,
					},
				},
			});
			await sweetMixinSuccessAlert('Appointment booked!');
			setSelectedSlot(null);
			setSymptoms('');
			setReason('');
			if (user?._id) await refetchAppointments();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>APPOINTMENTS MOBILE</h1>;

	return (
		<Stack sx={{ maxWidth: 1000, margin: '0 auto', py: 5, px: 2 }} spacing={4}>
			{doctorId && (
				<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
					<Typography variant="h5" sx={{ fontWeight: 700 }}>
						Book an appointment
						{doctor?.memberData ? ` with ${doctor.memberData.memberFullName || doctor.memberData.memberNick}` : ''}
					</Typography>
					{doctor?.specialization && <Chip label={doctor.specialization} color="primary" sx={{ width: 'fit-content' }} />}
					<Divider />
					<Box>
						<Typography sx={{ fontWeight: 600, mb: 1 }}>1. Choose a date</Typography>
						<TextField
							type="date"
							value={date}
							onChange={(e) => {
								setDate(e.target.value);
								setSelectedSlot(null);
							}}
							InputLabelProps={{ shrink: true }}
							inputProps={{ min: new Date().toISOString().split('T')[0] }}
						/>
					</Box>
					{date && (
						<Box>
							<Typography sx={{ fontWeight: 600, mb: 1 }}>2. Choose a time slot</Typography>
							<SlotPicker slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
						</Box>
					)}
					<TextField
						label="Symptoms (optional)"
						multiline
						rows={2}
						value={symptoms}
						onChange={(e) => setSymptoms(e.target.value)}
					/>
					<TextField label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
					<Button variant="contained" size="large" disabled={!selectedSlot} onClick={bookHandler} sx={{ width: 'fit-content' }}>
						Confirm booking
					</Button>
				</Stack>
			)}

			<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					My appointments
				</Typography>
				<Divider />
				{!user?._id ? (
					<Typography color="text.secondary">Please log in to see your appointments.</Typography>
				) : appointments.length === 0 ? (
					<Typography color="text.secondary">No appointments yet.</Typography>
				) : (
					appointments.map((a) => (
						<Stack
							key={a._id}
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							sx={{ p: 2, border: '1px solid #eee', borderRadius: '8px' }}
						>
							<Stack>
								<Typography sx={{ fontWeight: 600 }}>
									{a.doctorData?.memberData?.memberFullName || a.doctorData?.memberData?.memberNick || 'Doctor'}
									{a.doctorData?.specialization ? ` · ${a.doctorData.specialization}` : ''}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<Moment format="DD MMM YYYY">{a.appointmentDate}</Moment> · {a.startTime} - {a.endTime}
								</Typography>
							</Stack>
							<Chip label={a.appointmentStatus} size="small" />
						</Stack>
					))
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(AppointmentPage);
