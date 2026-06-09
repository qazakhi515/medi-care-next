import React from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import StethoscopeIcon from '@mui/icons-material/MedicalServicesOutlined';
import AnimatedAppointmentIcon from '../common/AnimatedAppointmentIcon';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';

interface QuickNavTile {
	label: string;
	caption: string;
	href: string;
	icon: React.ReactNode;
}

const TILES: QuickNavTile[] = [
	{
		label: 'Hospitals',
		caption: 'Browse trusted hospitals',
		href: '/hospital',
		icon: <LocalHospitalOutlinedIcon className="qn-icon-pulse" />,
	},
	{
		label: 'Doctors',
		caption: 'Meet our specialists',
		href: '/doctor',
		icon: <StethoscopeIcon className="qn-icon-sway" />,
	},
	{
		label: 'Appointments',
		caption: 'Book a visit by schedule',
		href: '/appointment',
		icon: <AnimatedAppointmentIcon />,
	},
	{
		label: 'My Profile',
		caption: 'Manage your patient record',
		href: '/patient-profile',
		icon: <AssignmentIndOutlinedIcon className="qn-icon-bob" />,
	},
];

/** QuickNav — simple, calm navigation tiles into the core Medi-care journeys. */
const QuickNav = () => {
	const router = useRouter();

	return (
		<Stack className={'quick-nav'}>
			<Stack className={'container'}>
				{TILES.map((tile) => (
					<Box
						component={'div'}
						className={'tile'}
						key={tile.label}
						onClick={() => router.push(tile.href)}
					>
						<div className={'icon'}>{tile.icon}</div>
						<div className={'text'}>
							<strong>{tile.label}</strong>
							<span>{tile.caption}</span>
						</div>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

export default QuickNav;
