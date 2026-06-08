import React, { useEffect, useState } from 'react';
import { Stack, Typography, Chip, Divider } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useQuery } from '@apollo/client';
import { GET_DOCTOR_SCHEDULES } from '../../../apollo/user/query';
import { Doctor } from '../../types/doctor/doctor';
import { DoctorSchedule } from '../../types/doctor-schedule/doctor-schedule';
import { DayOfWeek } from '../../enums/schedule.enum';
import { T } from '../../types/common';

interface HospitalDoctorScheduleProps {
	doctors: Doctor[];
}

const doctorName = (doctor?: Doctor) =>
	doctor?.memberData?.memberFullName || doctor?.memberData?.memberNick || 'Doctor';

/**
 * HospitalDoctorSchedule — additive "Doctor Schedule" section.
 * Shows the selected doctor's weekly working hours, reusing the schedule
 * rendering pattern from pages/doctor/detail.tsx. Includes a doctor switcher
 * when several doctors are available.
 */
const HospitalDoctorSchedule = ({ doctors }: HospitalDoctorScheduleProps) => {
	const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
	const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);

	/** default to the first doctor once the list arrives **/
	useEffect(() => {
		if (!selectedDoctorId && doctors.length > 0) {
			setSelectedDoctorId(doctors[0]._id);
		}
	}, [doctors, selectedDoctorId]);

	/** APOLLO REQUESTS **/
	useQuery(GET_DOCTOR_SCHEDULES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 50, search: { doctorId: selectedDoctorId } } },
		skip: !selectedDoctorId,
		onCompleted: (data: T) => setSchedules(data?.getDoctorSchedules?.list ?? []),
	});

	return (
		<Stack sx={{ mt: 4 }}>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
				<CalendarMonthOutlinedIcon sx={{ color: '#6b7256' }} />
				<Typography sx={{ fontSize: 22, fontWeight: 600, color: '#2f3327' }}>Doctor Schedule</Typography>
			</Stack>

			<div style={{ background: '#fff', border: '1px solid #e6e8df', borderRadius: 16, padding: 28 }}>
				{doctors.length === 0 ? (
					<Typography sx={{ color: '#707663', fontSize: 14 }}>No doctors available yet.</Typography>
				) : (
					<>
						{/* doctor switcher */}
						<Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
							{doctors.map((doctor) => {
								const active = doctor._id === selectedDoctorId;
								return (
									<Chip
										key={doctor._id}
										label={doctorName(doctor)}
										onClick={() => setSelectedDoctorId(doctor._id)}
										variant={active ? 'filled' : 'outlined'}
										sx={{
											cursor: 'pointer',
											fontWeight: active ? 600 : 400,
											color: active ? '#fff' : '#4f5641',
											backgroundColor: active ? '#6b7256' : 'transparent',
											borderColor: '#c7cdb8',
											'&:hover': { backgroundColor: active ? '#5b6149' : 'rgba(107,114,86,0.08)' },
										}}
									/>
								);
							})}
						</Stack>

						<Typography sx={{ fontSize: 16, fontWeight: 600, color: '#2f3327', mb: 1 }}>
							Working hours — {doctorName(doctors.find((d) => d._id === selectedDoctorId))}
						</Typography>
						<Divider sx={{ mb: 2 }} />

						{schedules.length === 0 ? (
							<Typography sx={{ color: '#707663', fontSize: 14 }}>No schedule published yet.</Typography>
						) : (
							<Stack spacing={1.2}>
								{Object.values(DayOfWeek).map((day) => {
									const daySchedules = schedules.filter((s) => s.dayOfWeek === day);
									return (
										<Stack key={day} direction="row" spacing={2} alignItems="center">
											<Typography sx={{ width: 120, fontWeight: 600, color: '#3f4536' }}>{day}</Typography>
											{daySchedules.length === 0 ? (
												<Typography sx={{ color: '#b0b5a4' }}>Closed</Typography>
											) : (
												<Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
													{daySchedules.map((s) => (
														<Chip
															key={s._id}
															label={`${s.startTime} - ${s.endTime} (${s.slotDuration}m)`}
															variant="outlined"
															sx={{ borderColor: '#c7cdb8', color: '#4f5641' }}
														/>
													))}
												</Stack>
											)}
										</Stack>
									);
								})}
							</Stack>
						)}
					</>
				)}
			</div>
		</Stack>
	);
};

export default HospitalDoctorSchedule;
