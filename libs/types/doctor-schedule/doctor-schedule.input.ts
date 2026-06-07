import { DayOfWeek, ScheduleStatus } from '../../enums/schedule.enum';
import { Direction } from '../../enums/common.enum';

export interface DoctorScheduleInput {
	doctorId: string;
	dayOfWeek: DayOfWeek;
	startTime: string;
	endTime: string;
	slotDuration?: number;
}

interface DSISearch {
	doctorId?: string;
	dayOfWeek?: DayOfWeek;
	scheduleStatus?: ScheduleStatus;
}

export interface DoctorSchedulesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: DSISearch;
}
