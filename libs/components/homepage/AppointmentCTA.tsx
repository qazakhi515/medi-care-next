import React from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import AnimatedAppointmentIcon from '../common/AnimatedAppointmentIcon';

/** AppointmentCTA — quiet closing band inviting patients to book a visit. */
const AppointmentCTA = () => {
	const router = useRouter();

	return (
		<Stack className={'appointment-cta'}>
			<Stack className={'container'}>
				<Box component={'div'} className={'text'}>
					<span className={'eyebrow'}>Ready when you are</span>
					<h2>Book your appointment with the right doctor</h2>
					<p>Choose a specialist, pick an available time from their schedule, and reserve your visit in minutes.</p>
				</Box>
				<Box component={'div'} className={'action'}>
					<button onClick={() => router.push('/appointment')}>
						<AnimatedAppointmentIcon /> Book Appointment
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default AppointmentCTA;
