import React from 'react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { SvgIconProps } from '@mui/material';

/**
 * AnimatedAppointmentIcon — the existing appointment/booking icon
 * (EventAvailableOutlinedIcon, design unchanged) with a subtle, looping
 * "alarm-like" CSS animation (small shake + soft pulse). CSS keyframes run on
 * render with no JS/hydration dependency; professional, mobile + desktop.
 * Props (incl. className) are forwarded to the underlying MUI icon.
 */
const AnimatedAppointmentIcon = (props: SvgIconProps) => {
	const { className, ...rest } = props;
	return (
		<EventAvailableOutlinedIcon
			className={['appointment-alarm-icon', className].filter(Boolean).join(' ')}
			{...rest}
		/>
	);
};

export default AnimatedAppointmentIcon;
