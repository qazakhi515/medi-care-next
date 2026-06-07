import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Chip } from '@mui/material';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { Doctor } from '../../types/doctor/doctor';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface DoctorCardProps {
	doctor: Doctor;
}

const DoctorCard = (props: DoctorCardProps) => {
	const { doctor } = props;
	const router = useRouter();
	const imagePath: string = doctor?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${doctor?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const pushDoctorDetail = async (doctorId: string) => {
		await router.push({ pathname: '/doctor/detail', query: { id: doctorId } });
	};

	return (
		<Stack
			component={'div'}
			sx={{
				width: 280,
				borderRadius: '12px',
				overflow: 'hidden',
				background: '#fff',
				boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
				cursor: 'pointer',
				transition: 'transform .2s',
				':hover': { transform: 'translateY(-4px)' },
			}}
			onClick={() => pushDoctorDetail(doctor._id)}
		>
			<Box
				component={'div'}
				sx={{
					height: 220,
					backgroundImage: `url(${imagePath})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<Stack sx={{ p: 2 }} spacing={1}>
				<Typography variant="h6" sx={{ fontWeight: 600 }}>
					{doctor?.memberData?.memberFullName || doctor?.memberData?.memberNick || 'Doctor'}
				</Typography>
				<Chip
					icon={<MedicalServicesOutlinedIcon />}
					label={doctor?.specialization}
					size="small"
					sx={{ width: 'fit-content' }}
					color="primary"
					variant="outlined"
				/>
				<Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
					<Typography variant="body2" color="text.secondary">
						{doctor?.experienceYears ?? 0} yrs exp.
					</Typography>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						${formatterStr(doctor?.consultationFee)}
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default DoctorCard;
