import React from 'react';
import { Stack, Chip, Typography } from '@mui/material';
import { DoctorSchedule } from '../../types/doctor-schedule/doctor-schedule';
import { DayOfWeek } from '../../enums/schedule.enum';

const DAY_INDEX: DayOfWeek[] = [
	DayOfWeek.SUNDAY,
	DayOfWeek.MONDAY,
	DayOfWeek.TUESDAY,
	DayOfWeek.WEDNESDAY,
	DayOfWeek.THURSDAY,
	DayOfWeek.FRIDAY,
	DayOfWeek.SATURDAY,
];

const toMinutes = (t: string): number => {
	const [h, m] = t.split(':').map(Number);
	return h * 60 + m;
};

const toTime = (mins: number): string => {
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export interface Slot {
	startTime: string;
	endTime: string;
}

/** Generate slots from the schedules matching the chosen date's day-of-week. */
export const generateSlots = (schedules: DoctorSchedule[], dateStr: string): Slot[] => {
	if (!dateStr) return [];
	const day = DAY_INDEX[new Date(dateStr).getDay()];
	const slots: Slot[] = [];
	schedules
		.filter((s) => s.dayOfWeek === day)
		.forEach((s) => {
			const start = toMinutes(s.startTime);
			const end = toMinutes(s.endTime);
			const dur = s.slotDuration || 30;
			for (let t = start; t + dur <= end; t += dur) {
				slots.push({ startTime: toTime(t), endTime: toTime(t + dur) });
			}
		});
	return slots;
};

interface SlotPickerProps {
	slots: Slot[];
	selected?: Slot | null;
	bookedStartTimes?: string[];
	onSelect: (slot: Slot) => void;
}

const SlotPicker = ({ slots, selected, bookedStartTimes = [], onSelect }: SlotPickerProps) => {
	if (slots.length === 0) {
		return <Typography color="text.secondary">No available slots for the selected date.</Typography>;
	}
	return (
		<Stack direction="row" flexWrap="wrap" gap={1}>
			{slots.map((slot) => {
				const booked = bookedStartTimes.includes(slot.startTime);
				const isSelected = selected?.startTime === slot.startTime;
				return (
					<Chip
						key={slot.startTime}
						label={slot.startTime}
						color={isSelected ? 'primary' : 'default'}
						variant={isSelected ? 'filled' : 'outlined'}
						disabled={booked}
						onClick={() => onSelect(slot)}
					/>
				);
			})}
		</Stack>
	);
};

export default SlotPicker;
