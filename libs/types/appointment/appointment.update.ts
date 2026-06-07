import { AppointmentStatus } from '../../enums/appointment.enum';

export interface AppointmentUpdate {
	_id: string;
	appointmentStatus?: AppointmentStatus;
	appointmentDate?: Date;
	startTime?: string;
	endTime?: string;
	symptoms?: string;
	cancellationReason?: string;
}
