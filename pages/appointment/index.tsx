import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery, useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { GET_DOCTORS, GET_DOCTOR, GET_DOCTOR_AVAILABILITY, GET_APPOINTMENTS } from '../../apollo/user/query';
import { CREATE_APPOINTMENT, UPDATE_APPOINTMENT } from '../../apollo/user/mutation';
import { Doctor } from '../../libs/types/doctor/doctor';
import { TimeSlot } from '../../libs/types/appointment/availability';
import { Appointment } from '../../libs/types/appointment/appointment';
import { Specialization } from '../../libs/enums/doctor.enum';
import { AppointmentStatus } from '../../libs/enums/appointment.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { userVar } from '../../apollo/store';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
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
	const urlDoctorId = router.query?.doctorId as string;

	/** WIZARD STATE **/
	const [step, setStep] = useState<number>(urlDoctorId ? 2 : 1);
	const [specialization, setSpecialization] = useState<string>('ALL');
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [selectedDate, setSelectedDate] = useState<string>('');
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [symptoms, setSymptoms] = useState<string>('');
	const [reason, setReason] = useState<string>('');
	const [appointments, setAppointments] = useState<Appointment[]>([]);

	/** APOLLO REQUESTS **/
	const { data: doctorsData } = useQuery(GET_DOCTORS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 100,
				sort: 'createdAt',
				direction: 'DESC',
				search: specialization === 'ALL' ? {} : { specializationList: [specialization] },
			},
		},
	});
	const doctors: Doctor[] = doctorsData?.getDoctors?.list ?? [];

	// Pre-select the doctor when arriving from the doctor detail page (?doctorId=...).
	useQuery(GET_DOCTOR, {
		fetchPolicy: 'network-only',
		variables: { input: urlDoctorId },
		skip: !urlDoctorId,
		onCompleted: (data: T) => {
			if (data?.getDoctor) setSelectedDoctor(data.getDoctor);
		},
	});

	const [getAvailability, { data: availabilityData, loading: availabilityLoading }] = useLazyQuery(
		GET_DOCTOR_AVAILABILITY,
		{ fetchPolicy: 'network-only' },
	);
	const availability = availabilityData?.getDoctorAvailability;

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

	/** HANDLERS **/
	const selectDoctorHandler = (doctor: Doctor) => {
		setSelectedDoctor(doctor);
		setSelectedDate('');
		setSelectedSlot(null);
		setStep(2);
	};

	const dateChangeHandler = (value: string) => {
		setSelectedDate(value);
		setSelectedSlot(null);
		if (value && selectedDoctor?._id) {
			getAvailability({ variables: { input: { doctorId: selectedDoctor._id, date: new Date(value) } } });
		}
	};

	const refreshAvailability = () => {
		if (selectedDoctor?._id && selectedDate) {
			getAvailability({ variables: { input: { doctorId: selectedDoctor._id, date: new Date(selectedDate) } } });
		}
	};

	const bookHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (user?.memberType !== MemberType.PATIENT) throw new Error('Only patients can book appointments');
			if (!selectedDoctor?._id || !selectedDate || !selectedSlot) throw new Error(Messages.error3);

			await createAppointment({
				variables: {
					input: {
						doctorId: selectedDoctor._id,
						appointmentDate: new Date(selectedDate),
						startTime: selectedSlot.startTime,
						endTime: selectedSlot.endTime,
						symptoms: symptoms || undefined,
						appointmentReason: reason || undefined,
					},
				},
			});

			await sweetMixinSuccessAlert('Appointment booked!');
			const res = await refetchAppointments();
			setAppointments(res?.data?.getAppointments?.list ?? []);

			// Reset the wizard — the new appointment now shows in "My appointments" below.
			setStep(1);
			setSelectedDoctor(null);
			setSelectedDate('');
			setSelectedSlot(null);
			setSymptoms('');
			setReason('');
		} catch (err: any) {
			// The slot may have just been taken — go back to step 2 and refresh the grid.
			setSelectedSlot(null);
			setStep(2);
			refreshAvailability();
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const cancelHandler = async (appointmentId: string) => {
		try {
			const { value: cancelReason, isConfirmed } = await Swal.fire({
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
						cancellationReason: cancelReason,
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

	const doctorName = (d?: Doctor | null) =>
		d?.memberData?.memberFullName || d?.memberData?.memberNick || 'Doctor';

	return (
		<div className="appointment-page">
			<div className="appt-container">
				<h1 className="page-title">Book an Appointment</h1>

				{/* STEPPER */}
				<div className="wizard-steps">
					<div className={`wstep ${step >= 1 ? 'active' : ''}`}>
						<span className="wnum">1</span> Doctor
					</div>
					<div className={`wline ${step >= 2 ? 'active' : ''}`} />
					<div className={`wstep ${step >= 2 ? 'active' : ''}`}>
						<span className="wnum">2</span> Date &amp; Time
					</div>
					<div className={`wline ${step >= 3 ? 'active' : ''}`} />
					<div className={`wstep ${step >= 3 ? 'active' : ''}`}>
						<span className="wnum">3</span> Confirm
					</div>
				</div>

				{/* STEP 1 — DOCTOR */}
				{step === 1 && (
					<div className="wizard-card">
						<div className="card-head">
							<h2 className="wizard-title">Choose a doctor</h2>
							<select
								className="spec-filter"
								title="Filter by specialization"
								value={specialization}
								onChange={(e) => setSpecialization(e.target.value)}
							>
								<option value="ALL">All specializations</option>
								{Object.values(Specialization).map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
						</div>
						{doctors.length === 0 ? (
							<p className="muted">No doctors found.</p>
						) : (
							<div className="doctor-grid">
								{doctors.map((d) => (
									<div key={d._id} className="doctor-card" onClick={() => selectDoctorHandler(d)}>
										<img
											className="doctor-avatar"
											src={
												d.memberData?.memberImage
													? `${REACT_APP_API_URL}/${d.memberData.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
										<div className="doctor-name">{doctorName(d)}</div>
										<div className="doctor-spec">{d.specialization}</div>
										<div className="doctor-meta">
											{d.experienceYears} yrs · ${d.consultationFee}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* STEP 2 — DATE & TIME */}
				{step === 2 && (
					<div className="wizard-card">
						<button type="button" className="back-link" onClick={() => setStep(1)}>
							← Change doctor
						</button>
						{!selectedDoctor ? (
							<p className="muted">Loading doctor…</p>
						) : (
							<>
								<h2 className="wizard-title">Pick a date &amp; time</h2>
								<div className="selected-doc">
									with <b>{doctorName(selectedDoctor)}</b> · {selectedDoctor.specialization}
								</div>

								<label className="field-label">Date</label>
								<input
									type="date"
									className="date-input"
									title="Appointment date"
									value={selectedDate}
									min={new Date().toISOString().split('T')[0]}
									onChange={(e) => dateChangeHandler(e.target.value)}
								/>

								{selectedDate && (
									<div className="slots-area">
										{availabilityLoading ? (
											<p className="muted">Loading availability…</p>
										) : !availability ? null : !availability.isWorkingDay ? (
											<p className="muted">The doctor does not work on this day. Please pick another date.</p>
										) : availability.slots.length === 0 ? (
											<p className="muted">No free slots left for this day. Please try another date.</p>
										) : (
											<div className="slot-grid">
												{availability.slots.map((s: TimeSlot) => (
													<button
														key={s.startTime}
														type="button"
														className={`slot ${selectedSlot?.startTime === s.startTime ? 'active' : ''}`}
														onClick={() => setSelectedSlot(s)}
													>
														{s.startTime} – {s.endTime}
													</button>
												))}
											</div>
										)}
									</div>
								)}

								<button type="button" className="primary-btn" disabled={!selectedSlot} onClick={() => setStep(3)}>
									Continue
								</button>
							</>
						)}
					</div>
				)}

				{/* STEP 3 — CONFIRM */}
				{step === 3 && selectedDoctor && selectedSlot && (
					<div className="wizard-card">
						<button type="button" className="back-link" onClick={() => setStep(2)}>
							← Change time
						</button>
						<h2 className="wizard-title">Confirm your appointment</h2>

						<div className="confirm-box">
							<div className="confirm-row">
								<span>Doctor</span>
								<b>{doctorName(selectedDoctor)}</b>
							</div>
							<div className="confirm-row">
								<span>Specialization</span>
								<b>{selectedDoctor.specialization}</b>
							</div>
							<div className="confirm-row">
								<span>Date</span>
								<b>
									<Moment format="DD MMM YYYY">{selectedDate}</Moment>
								</b>
							</div>
							<div className="confirm-row">
								<span>Time</span>
								<b>
									{selectedSlot.startTime} – {selectedSlot.endTime}
								</b>
							</div>
							<div className="confirm-row">
								<span>Fee</span>
								<b>${selectedDoctor.consultationFee}</b>
							</div>
						</div>

						<label className="field-label">Symptoms (optional)</label>
						<textarea
							className="text-input"
							rows={2}
							placeholder="Describe your symptoms"
							value={symptoms}
							onChange={(e) => setSymptoms(e.target.value)}
						/>
						<label className="field-label">Reason (optional)</label>
						<input
							className="text-input"
							placeholder="Reason for visit"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						/>

						<button type="button" className="primary-btn" disabled={!selectedSlot} onClick={bookHandler}>
							Confirm booking
						</button>
					</div>
				)}

				{/* MY APPOINTMENTS */}
				<div className="my-appts">
					<h2 className="wizard-title">My appointments</h2>
					{!user?._id ? (
						<p className="muted">Please log in to see your appointments.</p>
					) : appointments.length === 0 ? (
						<p className="muted">No appointments yet.</p>
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
				</div>
			</div>

			<style jsx>{`
				.appointment-page {
					padding: 40px 16px 80px;
				}
				.appt-container {
					max-width: 1000px;
					margin: 0 auto;
					display: flex;
					flex-direction: column;
					gap: 24px;
				}
				.page-title {
					font-size: 28px;
					font-weight: 800;
					margin: 0;
					color: #181a20;
				}
				/* Stepper */
				.wizard-steps {
					display: flex;
					align-items: center;
					gap: 8px;
				}
				.wstep {
					display: flex;
					align-items: center;
					gap: 8px;
					font-size: 14px;
					font-weight: 600;
					color: #9aa3b2;
				}
				.wstep.active {
					color: #1c4fb3;
				}
				.wnum {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					width: 26px;
					height: 26px;
					border-radius: 50%;
					background: #e7ebf3;
					color: #9aa3b2;
					font-size: 13px;
					font-weight: 700;
				}
				.wstep.active .wnum {
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					color: #fff;
				}
				.wline {
					flex: 1;
					height: 2px;
					background: #e7ebf3;
					border-radius: 2px;
				}
				.wline.active {
					background: #2a6cdf;
				}
				/* Cards */
				.wizard-card,
				.my-appts {
					background: #fff;
					border-radius: 14px;
					padding: 28px;
					box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
					display: flex;
					flex-direction: column;
					gap: 16px;
				}
				.card-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
					flex-wrap: wrap;
					gap: 12px;
				}
				.wizard-title {
					font-size: 20px;
					font-weight: 700;
					margin: 0;
					color: #181a20;
				}
				.muted {
					color: #8a93a6;
					font-size: 14px;
				}
				.back-link {
					align-self: flex-start;
					background: none;
					border: none;
					color: #1c4fb3;
					font-size: 14px;
					font-weight: 600;
					cursor: pointer;
					padding: 0;
				}
				/* Step 1 — doctors */
				.spec-filter {
					height: 40px;
					padding: 0 12px;
					border-radius: 8px;
					border: 1px solid #ddd;
					font-size: 14px;
					background: #fff;
					cursor: pointer;
				}
				.doctor-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
					gap: 16px;
				}
				.doctor-card {
					border: 1px solid #eef0f4;
					border-radius: 12px;
					padding: 18px;
					text-align: center;
					cursor: pointer;
					transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
				}
				.doctor-card:hover {
					transform: translateY(-3px);
					box-shadow: 0 8px 22px rgba(28, 79, 179, 0.15);
					border-color: #2a6cdf;
				}
				.doctor-avatar {
					width: 72px;
					height: 72px;
					border-radius: 50%;
					object-fit: cover;
					margin-bottom: 10px;
				}
				.doctor-name {
					font-size: 15px;
					font-weight: 700;
					color: #181a20;
				}
				.doctor-spec {
					font-size: 13px;
					color: #2a6cdf;
					font-weight: 600;
					margin-top: 2px;
				}
				.doctor-meta {
					font-size: 12px;
					color: #8a93a6;
					margin-top: 4px;
				}
				/* Step 2 — date & slots */
				.selected-doc {
					font-size: 14px;
					color: #555e70;
				}
				.field-label {
					font-size: 13px;
					font-weight: 600;
					color: #181a20;
				}
				.date-input,
				.text-input {
					height: 46px;
					padding: 0 14px;
					border: 1px solid #ddd;
					border-radius: 8px;
					font-size: 14px;
					font-family: inherit;
					width: 100%;
					max-width: 280px;
				}
				.text-input {
					max-width: 100%;
				}
				textarea.text-input {
					height: auto;
					padding: 10px 14px;
					resize: vertical;
				}
				.slot-grid {
					display: flex;
					flex-wrap: wrap;
					gap: 10px;
				}
				.slot {
					padding: 8px 14px;
					border-radius: 8px;
					border: 1px solid #d7dce5;
					background: #fff;
					color: #303a4d;
					font-size: 13px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.12s ease;
				}
				.slot:hover {
					border-color: #2a6cdf;
				}
				.slot.active {
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					border-color: #1c4fb3;
					color: #fff;
				}
				/* Step 3 — confirm */
				.confirm-box {
					display: flex;
					flex-direction: column;
					gap: 10px;
					padding: 18px;
					border-radius: 10px;
					background: #f6f8fc;
				}
				.confirm-row {
					display: flex;
					justify-content: space-between;
					font-size: 14px;
				}
				.confirm-row span {
					color: #8a93a6;
				}
				.confirm-row b {
					color: #181a20;
				}
				/* Primary button */
				.primary-btn {
					align-self: flex-start;
					padding: 12px 26px;
					border: none;
					border-radius: 10px;
					background: linear-gradient(135deg, #2a6cdf, #1c4fb3);
					color: #fff;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
				}
				.primary-btn:hover:not(:disabled) {
					transform: translateY(-2px);
					box-shadow: 0 8px 20px rgba(28, 79, 179, 0.35);
				}
				.primary-btn:disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
				/* My appointments card (blue) */
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
				.my-appts {
					gap: 18px;
				}
			`}</style>
		</div>
	);
};

export default withLayoutBasic(AppointmentPage);
