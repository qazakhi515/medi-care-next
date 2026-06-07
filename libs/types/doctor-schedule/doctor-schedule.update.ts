import { DayOfWeek, ScheduleStatus } from '../../enums/schedule.enum';

export interface DoctorScheduleUpdate {
	_id: string;
	scheduleStatus?: ScheduleStatus;
	dayOfWeek?: DayOfWeek;
	startTime?: string;
	endTime?: string;
	slotDuration?: number;
}
