import { DayOfWeek, ScheduleStatus } from '../../enums/schedule.enum';
import { TotalCounter } from '../hospital/hospital';

export interface DoctorSchedule {
	_id: string;
	doctorId: string;
	scheduleStatus: ScheduleStatus;
	dayOfWeek: DayOfWeek;
	startTime: string;
	endTime: string;
	slotDuration: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface DoctorSchedules {
	list: DoctorSchedule[];
	metaCounter: TotalCounter[];
}
