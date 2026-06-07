import { AppointmentStatus } from '../../enums/appointment.enum';
import { Direction } from '../../enums/common.enum';

export interface AppointmentInput {
	doctorId: string;
	appointmentDate: Date;
	startTime: string;
	endTime: string;
	symptoms?: string;
	appointmentReason?: string;
}

interface AppointmentPeriod {
	start: Date | number;
	end: Date | number;
}

interface ApptISearch {
	doctorId?: string;
	patientId?: string;
	appointmentStatus?: AppointmentStatus;
	periodsRange?: AppointmentPeriod;
}

export interface AppointmentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ApptISearch;
}
