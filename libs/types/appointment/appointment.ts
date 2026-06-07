import { AppointmentStatus } from '../../enums/appointment.enum';
import { Member } from '../member/member';
import { Doctor } from '../doctor/doctor';
import { TotalCounter } from '../hospital/hospital';

export interface Appointment {
	_id: string;
	patientId: string;
	doctorId: string;
	appointmentDate: Date;
	startTime: string;
	endTime: string;
	symptoms?: string;
	appointmentStatus: AppointmentStatus;
	appointmentReason?: string;
	cancellationReason?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	patientData?: Member;
	doctorData?: Doctor;
}

export interface Appointments {
	list: Appointment[];
	metaCounter: TotalCounter[];
}
