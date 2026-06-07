import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Typography, Button, Divider, MenuItem, TextField } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PATIENT_PROFILE } from '../../apollo/user/query';
import { CREATE_PATIENT_PROFILE, UPDATE_PATIENT_PROFILE } from '../../apollo/user/mutation';
import { PatientProfile } from '../../libs/types/patient-profile/patient-profile';
import { Gender, BloodType } from '../../libs/enums/patient-profile.enum';
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

const PatientProfilePage: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const [exists, setExists] = useState<boolean>(false);
	const [form, setForm] = useState<any>({
		birthDate: '',
		gender: '',
		bloodType: '',
		chronicDiseases: '',
		emergencyContact: '',
	});

	/** APOLLO REQUESTS **/
	useQuery(GET_PATIENT_PROFILE, {
		fetchPolicy: 'network-only',
		skip: !user?._id,
		onCompleted: (data: T) => {
			const profile: PatientProfile = data?.getPatientProfile;
			if (profile?._id) {
				setExists(true);
				setForm({
					birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
					gender: profile.gender ?? '',
					bloodType: profile.bloodType ?? '',
					chronicDiseases: profile.chronicDiseases ?? '',
					emergencyContact: profile.emergencyContact ?? '',
				});
			}
		},
		onError: () => setExists(false),
	});

	const [createPatientProfile] = useMutation(CREATE_PATIENT_PROFILE);
	const [updatePatientProfile] = useMutation(UPDATE_PATIENT_PROFILE);

	/** HANDLERS **/
	const changeHandler = (key: string, value: string) => setForm({ ...form, [key]: value });

	const saveHandler = async () => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (user?.memberType !== MemberType.PATIENT) throw new Error('Only patients have a medical profile');

			const input = {
				birthDate: form.birthDate ? new Date(form.birthDate) : undefined,
				gender: form.gender || undefined,
				bloodType: form.bloodType || undefined,
				chronicDiseases: form.chronicDiseases || undefined,
				emergencyContact: form.emergencyContact || undefined,
			};

			if (exists) {
				await updatePatientProfile({ variables: { input } });
			} else {
				await createPatientProfile({ variables: { input } });
				setExists(true);
			}
			await sweetMixinSuccessAlert('Profile saved!');
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>PATIENT PROFILE MOBILE</h1>;

	return (
		<Stack sx={{ maxWidth: 700, margin: '0 auto', py: 5, px: 2 }}>
			<Stack sx={{ background: '#fff', p: 4, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} spacing={2}>
				<Typography variant="h5" sx={{ fontWeight: 700 }}>
					My Medical Profile
				</Typography>
				<Divider />
				{!user?._id ? (
					<Typography color="text.secondary">Please log in to manage your medical profile.</Typography>
				) : (
					<>
						<TextField
							label="Birth date"
							type="date"
							value={form.birthDate}
							onChange={(e) => changeHandler('birthDate', e.target.value)}
							InputLabelProps={{ shrink: true }}
						/>
						<TextField select label="Gender" value={form.gender} onChange={(e) => changeHandler('gender', e.target.value)}>
							<MenuItem value="">—</MenuItem>
							{Object.values(Gender).map((g) => (
								<MenuItem key={g} value={g}>
									{g}
								</MenuItem>
							))}
						</TextField>
						<TextField
							select
							label="Blood type"
							value={form.bloodType}
							onChange={(e) => changeHandler('bloodType', e.target.value)}
						>
							<MenuItem value="">—</MenuItem>
							{Object.values(BloodType).map((b) => (
								<MenuItem key={b} value={b}>
									{b.replace('_', ' ')}
								</MenuItem>
							))}
						</TextField>
						<TextField
							label="Chronic diseases"
							multiline
							rows={2}
							value={form.chronicDiseases}
							onChange={(e) => changeHandler('chronicDiseases', e.target.value)}
						/>
						<TextField
							label="Emergency contact"
							value={form.emergencyContact}
							onChange={(e) => changeHandler('emergencyContact', e.target.value)}
						/>
						<Button variant="contained" size="large" onClick={saveHandler} sx={{ width: 'fit-content' }}>
							{exists ? 'Update profile' : 'Create profile'}
						</Button>
					</>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(PatientProfilePage);
