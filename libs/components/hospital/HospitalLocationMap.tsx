import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Hospital } from '../../types/hospital/hospital';

interface HospitalLocationMapProps {
	hospital: Hospital;
}

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
	<Stack direction="row" spacing={1.5} alignItems="flex-start">
		<Box sx={{ color: '#6b7256', mt: '2px' }}>{icon}</Box>
		<Box>
			<Typography sx={{ fontSize: 12, color: '#909684', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
				{label}
			</Typography>
			<Typography sx={{ fontSize: 15, color: '#3f4536', fontWeight: 500 }}>{value || '—'}</Typography>
		</Box>
	</Stack>
);

/**
 * HospitalLocationMap — additive "Address & Map" section.
 * Address + contact info and a keyless embedded map derived from the hospital
 * address. Independent of the page's existing hardcoded iframe (left untouched).
 */
const HospitalLocationMap = ({ hospital }: HospitalLocationMapProps) => {
	const address = hospital?.hospitalAddress?.trim();
	const mapQuery = encodeURIComponent(address || hospital?.hospitalLocation || 'hospital');
	const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

	return (
		<Stack sx={{ mt: 4 }}>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
				<PlaceOutlinedIcon sx={{ color: '#6b7256' }} />
				<Typography sx={{ fontSize: 22, fontWeight: 600, color: '#2f3327' }}>Address & Map</Typography>
			</Stack>

			<Stack
				direction={{ xs: 'column', md: 'row' }}
				sx={{
					background: '#fff',
					border: '1px solid #e6e8df',
					borderRadius: '16px',
					overflow: 'hidden',
				}}
			>
				{/* info column */}
				<Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3.5 }, flex: '0 0 auto', width: { xs: '100%', md: 320 } }}>
					<Row icon={<PlaceOutlinedIcon />} label="Address" value={address} />
					<Row icon={<LocationCityOutlinedIcon />} label="Location" value={hospital?.hospitalLocation} />
					<Row icon={<PhoneOutlinedIcon />} label="Contact" value={hospital?.memberData?.memberPhone} />
					<Row
						icon={<PersonOutlineOutlinedIcon />}
						label="Managed by"
						value={hospital?.memberData?.memberFullName || hospital?.memberData?.memberNick}
					/>
				</Stack>

				{/* map column */}
				<Box sx={{ flex: 1, minHeight: { xs: 260, md: 'auto' }, borderLeft: { md: '1px solid #e6e8df' } }}>
					<iframe
						title="hospital-location"
						src={mapSrc}
						width="100%"
						height="100%"
						style={{ border: 0, display: 'block', minHeight: 260 }}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</Box>
			</Stack>
		</Stack>
	);
};

export default HospitalLocationMap;
