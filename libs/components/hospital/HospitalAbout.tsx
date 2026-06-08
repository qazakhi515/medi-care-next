import React from 'react';
import { Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { Hospital } from '../../types/hospital/hospital';
import { Doctor } from '../../types/doctor/doctor';
import DoctorCard from '../doctor/DoctorCard';

interface HospitalAboutProps {
	hospital: Hospital;
	doctors: Doctor[];
}

/**
 * HospitalAbout — additive "About Hospital" section.
 * Hospital description + a Doctors subsection that reuses the existing DoctorCard.
 * NOTE: the backend has no hospital↔doctor relation yet, so doctors are shown
 * platform-wide (active doctors), not filtered to this hospital. See the caption.
 * Layout uses native elements to keep MUI sx-type inference light.
 */
const HospitalAbout = ({ hospital, doctors }: HospitalAboutProps) => {
	const description = hospital?.hospitalDesc?.trim();

	return (
		<div style={{ marginTop: 32 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
				<InfoOutlinedIcon sx={{ color: '#6b7256' }} />
				<Typography sx={{ fontSize: 22, fontWeight: 600, color: '#2f3327' }}>About Hospital</Typography>
			</div>

			<div style={{ background: '#fff', border: '1px solid #e6e8df', borderRadius: 16, padding: 28 }}>
				<Typography sx={{ fontSize: 15, lineHeight: 1.7, color: '#3f4536', whiteSpace: 'pre-line' }}>
					{description || `${hospital?.hospitalTitle || 'This hospital'} has not published a detailed description yet.`}
				</Typography>

				{/* Doctors subsection */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 32, marginBottom: 4 }}>
					<MedicalServicesOutlinedIcon sx={{ color: '#6b7256' }} />
					<Typography sx={{ fontSize: 18, fontWeight: 600, color: '#2f3327' }}>Doctors</Typography>
				</div>
				<Typography sx={{ fontSize: 13, color: '#909684', marginBottom: 16 }}>
					Showing active doctors on Medi-care. Linking doctors to a specific hospital is pending backend support.
				</Typography>

				{doctors.length === 0 ? (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: 140,
							border: '1px dashed #e6e8df',
							borderRadius: 14,
							color: '#707663',
							fontSize: 14,
						}}
					>
						No doctors available yet
					</div>
				) : (
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
						{doctors.map((doctor) => (
							<DoctorCard doctor={doctor} key={doctor._id} />
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default HospitalAbout;
