import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Typography, Button, Divider, MenuItem, TextField, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_DOCTORS, GET_DOCTOR_SCHEDULES, GET_HOSPITALS } from '../../apollo/user/query';
import {
	CREATE_DOCTOR,
	UPDATE_DOCTOR,
	CREATE_DOCTOR_SCHEDULE,
	REMOVE_DOCTOR_SCHEDULE,
} from '../../apollo/user/mutation';
import { Doctor } from '../../libs/types/doctor/doctor';
import { DoctorSchedule } from '../../libs/types/doctor-schedule/doctor-schedule';
import { Specialization } from '../../libs/enums/doctor.enum';
import { DayOfWeek } from '../../libs/enums/schedule.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { userVar } from '../../apollo/store';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DoctorManage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [myDoctor, setMyDoctor] = useState<Doctor | null>(null);
	const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
	const [hospitals, setHospitals] = useState<any[]>([]);
	const [profileForm, setProfileForm] = useState<any>({
		specialization: Specialization.OTHER,
		licenseNumber: '',
		experienceYears: 0,
		consultationFee: 0,
		education: '',
		certificates: '',
		hospitalId: '',
	});
	const [slotForm, setSlotForm] = useState<any>({
		dayOfWeek: DayOfWeek.MONDAY,
		startTime: '09:00',
		endTime: '17:00',
		slotDuration: 30,
	});

	/** APOLLO REQUESTS **/
	const { refetch: refetchDoctors } = useQuery(GET_DOCTORS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 100, search: {} } },
		skip: !user?._id,
		onCompleted: (data: T) => {
			const mine = (data?.getDoctors?.list ?? []).find((d: Doctor) => d.memberData?._id === user?._id);
			setMyDoctor(mine ?? null);
		},
	});

	const { refetch: refetchSchedules } = useQuery(GET_DOCTOR_SCHEDULES, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 50, search: { doctorId: myDoctor?._id } } },
		skip: !myDoctor?._id,
		onCompleted: (data: T) => setSchedules(data?.getDoctorSchedules?.list ?? []),
	});

	useQuery(GET_HOSPITALS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: { page: 1, limit: 100, sort: 'createdAt', direction: 'DESC', search: {} } },
		onCompleted: (data: T) => setHospitals(data?.getHospitals?.list ?? []),
	});

	const [createDoctor] = useMutation(CREATE_DOCTOR);
	const [updateDoctor] = useMutation(UPDATE_DOCTOR);
	const [createDoctorSchedule] = useMutation(CREATE_DOCTOR_SCHEDULE);
	const [removeDoctorSchedule] = useMutation(REMOVE_DOCTOR_SCHEDULE);

	const [editHospitalId, setEditHospitalId] = useState<string>('');
	useEffect(() => {
		setEditHospitalId(myDoctor?.hospitalId ?? '');
	}, [myDoctor]);

	const updateHospitalHandler = async () => {
		try {
			if (!myDoctor?._id) return;
			await updateDoctor({
				variables: { input: { _id: myDoctor._id, hospitalId: editHospitalId || undefined } },
			});
			await sweetMixinSuccessAlert('Hospital updated!');
			const res = await refetchDoctors();
			const mine = (res?.data?.getDoctors?.list ?? []).find((d: Doctor) => d.memberData?._id === user?._id);
			setMyDoctor(mine ?? null);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** HANDLERS **/
	const createProfileHandler = async () => {
		try {
			if (!profileForm.licenseNumber) throw new Error(Messages.error3);
			await createDoctor({
				variables: {
					input: {
						specialization: profileForm.specialization,
						licenseNumber: profileForm.licenseNumber,
						experienceYears: Number(profileForm.experienceYears) || undefined,
						consultationFee: Number(profileForm.consultationFee) || undefined,
						education: profileForm.education || undefined,
						certificates: profileForm.certificates || undefined,
						hospitalId: profileForm.hospitalId || undefined,
					},
				},
			});
			await sweetMixinSuccessAlert('Doctor profile created!');
			const res = await refetchDoctors();
			const mine = (res?.data?.getDoctors?.list ?? []).find((d: Doctor) => d.memberData?._id === user?._id);
			setMyDoctor(mine ?? null);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const addSlotHandler = async () => {
		try {
			if (!myDoctor?._id) throw new Error('Create your doctor profile first');
			await createDoctorSchedule({
				variables: {
					input: {
						doctorId: myDoctor._id,
						dayOfWeek: slotForm.dayOfWeek,
						startTime: slotForm.startTime,
						endTime: slotForm.endTime,
						slotDuration: Number(slotForm.slotDuration) || 30,
					},
				},
			});
			await sweetMixinSuccessAlert('Schedule added!');
			await refetchSchedules();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const removeSlotHandler = async (scheduleId: string) => {
		try {
			await removeDoctorSchedule({ variables: { input: scheduleId } });
			await refetchSchedules();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>DOCTOR MANAGE MOBILE</h1>;

	if (!user?._id) {
		return (
			<Stack sx={{ maxWidth: 700, margin: '0 auto', py: 8, px: 2 }}>
				<Typography color="text.secondary">Please log in.</Typography>
			</Stack>
		);
	}
	if (user?.memberType !== MemberType.DOCTOR) {
		return (
			<Stack sx={{ maxWidth: 700, margin: '0 auto', py: 8, px: 2 }}>
				<Typography color="text.secondary">This page is available to doctors only.</Typography>
			</Stack>
		);
	}

	return (
		<Stack sx={{ maxWidth: 800, margin: '0 auto', py: 5, px: 2 }} spacing={4}>
			{!myDoctor ? (
				<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
					<Typography variant="h5" sx={{ fontWeight: 700 }}>
						Create your doctor profile
					</Typography>
					<Divider />
					<TextField
						select
						label="Specialization"
						value={profileForm.specialization}
						onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
					>
						{Object.values(Specialization).map((s) => (
							<MenuItem key={s} value={s}>
								{s}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label="Hospital"
						value={profileForm.hospitalId}
						onChange={(e) => setProfileForm({ ...profileForm, hospitalId: e.target.value })}
						helperText="Select the hospital you work at"
					>
						<MenuItem value="">
							<em>Not selected</em>
						</MenuItem>
						{hospitals.map((h) => (
							<MenuItem key={h._id} value={h._id}>
								{h.hospitalTitle}
							</MenuItem>
						))}
					</TextField>
					<TextField
						label="License number"
						value={profileForm.licenseNumber}
						onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })}
					/>
					<TextField
						label="Experience (years)"
						type="number"
						value={profileForm.experienceYears}
						onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
					/>
					<TextField
						label="Consultation fee"
						type="number"
						value={profileForm.consultationFee}
						onChange={(e) => setProfileForm({ ...profileForm, consultationFee: e.target.value })}
					/>
					<TextField
						label="Education"
						value={profileForm.education}
						onChange={(e) => setProfileForm({ ...profileForm, education: e.target.value })}
					/>
					<TextField
						label="Certificates"
						value={profileForm.certificates}
						onChange={(e) => setProfileForm({ ...profileForm, certificates: e.target.value })}
					/>
					<Button variant="contained" size="large" onClick={createProfileHandler} sx={{ width: 'fit-content' }}>
						Create profile
					</Button>
				</Stack>
			) : (
				<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={1}>
					<Typography variant="h5" sx={{ fontWeight: 700 }}>
						My doctor profile
					</Typography>
					<Divider sx={{ mb: 1 }} />
					<Stack direction="row" spacing={1}>
						<Chip label={myDoctor.specialization} color="primary" />
						<Chip label={myDoctor.doctorStatus} variant="outlined" />
					</Stack>
					<Typography color="text.secondary">License: {myDoctor.licenseNumber}</Typography>
					<Typography color="text.secondary">Consultation fee: ${myDoctor.consultationFee}</Typography>
					<Divider sx={{ my: 1 }} />
					<Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
						<TextField
							select
							label="Hospital"
							size="small"
							value={editHospitalId}
							onChange={(e) => setEditHospitalId(e.target.value)}
							sx={{ minWidth: 260 }}
						>
							<MenuItem value="">
								<em>Not selected</em>
							</MenuItem>
							{hospitals.map((h) => (
								<MenuItem key={h._id} value={h._id}>
									{h.hospitalTitle}
								</MenuItem>
							))}
						</TextField>
						<Button variant="outlined" onClick={updateHospitalHandler}>
							Save hospital
						</Button>
					</Stack>
				</Stack>
			)}

			{myDoctor && (
				<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
					<Typography variant="h5" sx={{ fontWeight: 700 }}>
						My schedule
					</Typography>
					<Divider />
					<Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
						<TextField
							select
							label="Day"
							size="small"
							value={slotForm.dayOfWeek}
							onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value })}
							sx={{ minWidth: 140 }}
						>
							{Object.values(DayOfWeek).map((d) => (
								<MenuItem key={d} value={d}>
									{d}
								</MenuItem>
							))}
						</TextField>
						<TextField
							label="Start"
							type="time"
							size="small"
							value={slotForm.startTime}
							onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="End"
							type="time"
							size="small"
							value={slotForm.endTime}
							onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField
							label="Slot (min)"
							type="number"
							size="small"
							value={slotForm.slotDuration}
							onChange={(e) => setSlotForm({ ...slotForm, slotDuration: e.target.value })}
							sx={{ width: 110 }}
						/>
						<Button variant="contained" onClick={addSlotHandler}>
							Add
						</Button>
					</Stack>
					<Divider />
					{schedules.length === 0 ? (
						<Typography color="text.secondary">No schedule slots yet.</Typography>
					) : (
						schedules.map((s) => (
							<Stack key={s._id} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, border: '1px solid #eee', borderRadius: '8px' }}>
								<Typography>
									<strong>{s.dayOfWeek}</strong> · {s.startTime} - {s.endTime} · {s.slotDuration}m
								</Typography>
								<IconButton size="small" onClick={() => removeSlotHandler(s._id)}>
									<DeleteIcon fontSize="small" />
								</IconButton>
							</Stack>
						))
					)}
				</Stack>
			)}
		</Stack>
	);
};

export default withLayoutBasic(DoctorManage);
