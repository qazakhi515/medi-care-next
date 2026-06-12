import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Typography, Button, TextField, Divider, Chip } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import { GET_APPOINTMENTS, GET_DOCTOR, GET_DOCTOR_SCHEDULES } from '../../apollo/user/query';
import { CREATE_APPOINTMENT, UPDATE_APPOINTMENT } from '../../apollo/user/mutation';
import SlotPicker, { generateSlots, Slot } from '../../libs/components/appointment/SlotPicker';
import { Appointment } from '../../libs/types/appointment/appointment';
import { Doctor } from '../../libs/types/doctor/doctor';
import { DoctorSchedule } from '../../libs/types/doctor-schedule/doctor-schedule';
import { userVar } from '../../apollo/store';
import { MemberType } from '../../libs/enums/member.enum';
import { AppointmentStatus } from '../../libs/enums/appointment.enum';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import Swal from 'sweetalert2';
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
		variables: {
			input: {
				page: 1,
				limit: 50,
				sort: 'appointmentDate',
				direction: 'DESC',
				search: { patientId: user?._id },
			},
		},
		skip: !user?._id,
		onCompleted: (data: T) => setAppointments(data?.getAppointments?.list ?? []),
	});

	const [createAppointment] = useMutation(CREATE_APPOINTMENT);
	const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

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
			const res = await refetchAppointments();
			setAppointments(res?.data?.getAppointments?.list ?? []);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const cancelHandler = async (appointmentId: string) => {
		try {
			const { value: reason, isConfirmed } = await Swal.fire({
				icon: 'warning',
				title: 'Cancel appointment?',
				input: 'text',
				inputLabel: 'Reason for cancellation',
				inputPlaceholder: 'Enter a reason (min 3 characters)',
				showCancelButton: true,
				confirmButtonColor: '#e92C28',
				inputValidator: (value) => {
					if (!value || value.trim().length < 3) return 'Please enter at least 3 characters';
					return null;
				},
			});
			if (!isConfirmed) return;

			await updateAppointment({
				variables: {
					input: {
						_id: appointmentId,
						appointmentStatus: AppointmentStatus.CANCELLED,
						cancellationReason: reason,
					},
				},
			});
			await sweetMixinSuccessAlert('Appointment cancelled!');
			const res = await refetchAppointments();
			setAppointments(res?.data?.getAppointments?.list ?? []);
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
						<div className="appt-card" key={a._id}>
							<div className="appt-content">
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1, y: [0, -5, 0] }}
									transition={{
										opacity: { duration: 0.5 },
										y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
									}}
									style={{ display: 'inline-block' }}
								>
									<h3 className="appt-title">Your Next Appointment</h3>
								</motion.div>
								<p className="appt-note">Please give 24 hours notice if you need to cancel or reschedule</p>
								<div className="appt-doctor">
									{a.doctorData?.memberData?.memberFullName || a.doctorData?.memberData?.memberNick || 'Doctor'}
									{a.doctorData?.specialization ? ` · ${a.doctorData.specialization}` : ''}
								</div>
								<div className="appt-datebox">
									<div className="appt-row">
										<span>DATE</span>
										<b>
											<Moment format="DD MMM YYYY">{a.appointmentDate}</Moment>
										</b>
									</div>
									<div className="appt-row">
										<span>TIME</span>
										<b>
											{a.startTime} - {a.endTime}
										</b>
									</div>
								</div>
								<div className="appt-footer">
									<span className="appt-status">{a.appointmentStatus}</span>
									{(a.appointmentStatus === AppointmentStatus.PENDING ||
										a.appointmentStatus === AppointmentStatus.CONFIRMED) && (
										<button type="button" className="appt-cancel" onClick={() => cancelHandler(a._id)}>
											Cancel
										</button>
									)}
								</div>
							</div>
						</div>
					))
				)}
				<style jsx>{`
					.appt-card {
						position: relative;
						overflow: hidden;
						border-radius: 16px;
						padding: 26px 28px 24px;
						color: #fff;
						background: linear-gradient(135deg, #2a6cdf 0%, #1c4fb3 60%, #143a8c 100%);
						box-shadow: 0 10px 30px rgba(20, 60, 150, 0.25);
					}
					.appt-card::before {
						content: '';
						position: absolute;
						right: -10%;
						bottom: -55%;
						width: 130%;
						height: 95%;
						background: linear-gradient(180deg, #eef2f7 0%, #b7bfcb 55%, #828d9c 100%);
						border-radius: 45% 45% 0 0 / 65% 65% 0 0;
						transform: rotate(-8deg);
						opacity: 0.16;
						pointer-events: none;
					}
					.appt-content {
						position: relative;
						z-index: 1;
					}
					.appt-title {
						margin: 0;
						font-size: 23px;
						font-weight: 800;
						letter-spacing: 0.3px;
					}
					.appt-note {
						margin: 6px 0 18px;
						max-width: 320px;
						font-size: 11px;
						line-height: 1.5;
						text-transform: uppercase;
						letter-spacing: 0.4px;
						opacity: 0.82;
					}
					.appt-doctor {
						margin-bottom: 12px;
						font-size: 14px;
						font-weight: 600;
					}
					.appt-datebox {
						display: flex;
						flex-direction: column;
						gap: 8px;
						max-width: 300px;
						padding: 14px 18px;
						border-radius: 10px;
						background: #fff;
						color: #1a2b4a;
					}
					.appt-row {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 16px;
						padding-bottom: 7px;
						border-bottom: 1px solid #e3e7ee;
					}
					.appt-row:last-child {
						padding-bottom: 0;
						border-bottom: none;
					}
					.appt-row span {
						font-size: 11px;
						font-weight: 700;
						letter-spacing: 1px;
						color: #6b7896;
					}
					.appt-row b {
						font-size: 15px;
						font-weight: 700;
					}
					.appt-footer {
						display: flex;
						align-items: center;
						gap: 12px;
						margin-top: 16px;
					}
					.appt-status {
						padding: 4px 12px;
						border-radius: 20px;
						border: 1px solid rgba(255, 255, 255, 0.5);
						background: rgba(255, 255, 255, 0.2);
						font-size: 12px;
						font-weight: 600;
					}
					.appt-cancel {
						padding: 5px 14px;
						border-radius: 20px;
						border: 1px solid #fff;
						background: transparent;
						color: #fff;
						font-size: 13px;
						font-weight: 600;
						cursor: pointer;
						transition: all 0.15s ease;
					}
					.appt-cancel:hover {
						background: #fff;
						color: #1c4fb3;
					}
				`}</style>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(AppointmentPage);
