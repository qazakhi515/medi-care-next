import React from 'react';
import { Typography } from '@mui/material';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import { Hospital } from '../../types/hospital/hospital';

interface HospitalEquipmentProps {
	hospital: Hospital;
}

/**
 * HospitalEquipment — additive "Medical Equipment Introduction" section.
 * Generic, non-hospital-specific professional copy + dynamic facility stats
 * pulled from the hospital record (shown only when present). Native-div layout
 * keeps MUI sx-type inference light.
 */
const HospitalEquipment = ({ hospital }: HospitalEquipmentProps) => {
	const stats: { icon: React.ReactNode; label: string; value: string }[] = [];

	if (hospital?.hospitalType) {
		stats.push({ icon: <LocalHospitalOutlinedIcon />, label: 'Department', value: String(hospital.hospitalType) });
	}
	if (hospital?.hospitalBeds) {
		stats.push({ icon: <KingBedOutlinedIcon />, label: 'Inpatient beds', value: `${hospital.hospitalBeds}` });
	}
	if (hospital?.hospitalRooms) {
		stats.push({ icon: <MeetingRoomOutlinedIcon />, label: 'Consultation rooms', value: `${hospital.hospitalRooms}` });
	}
	if (hospital?.hospitalSquare) {
		stats.push({ icon: <SquareFootOutlinedIcon />, label: 'Facility area', value: `${hospital.hospitalSquare} m²` });
	}

	return (
		<div style={{ marginTop: 32 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
				<BiotechOutlinedIcon sx={{ color: '#6b7256' }} />
				<Typography sx={{ fontSize: 22, fontWeight: 600, color: '#2f3327' }}>Medical Equipment</Typography>
			</div>

			<div style={{ background: '#fff', border: '1px solid #e6e8df', borderRadius: 16, padding: 28 }}>
				<Typography sx={{ fontSize: 15, lineHeight: 1.7, color: '#3f4536' }}>
					This hospital is equipped to modern clinical standards — diagnostic imaging, monitored treatment rooms and
					sterilised procedure areas — so patients receive safe, well-supported care across its departments.
				</Typography>

				{stats.length > 0 && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
							gap: 16,
							marginTop: 24,
						}}
					>
						{stats.map((s) => (
							<div
								key={s.label}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 12,
									padding: '16px 18px',
									border: '1px solid #e6e8df',
									borderRadius: 14,
									background: '#f6f7f3',
								}}
							>
								<span style={{ color: '#6b7256', display: 'inline-flex' }}>{s.icon}</span>
								<span>
									<Typography sx={{ fontSize: 12, color: '#909684', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
										{s.label}
									</Typography>
									<Typography sx={{ fontSize: 16, fontWeight: 600, color: '#2f3327' }}>{s.value}</Typography>
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default HospitalEquipment;
