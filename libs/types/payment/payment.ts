import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import { Member } from '../member/member';
import { Doctor } from '../doctor/doctor';
import { TotalCounter } from '../hospital/hospital';

export interface Payment {
	_id: string;
	appointmentId: string;
	patientId: string;
	doctorId: string;
	paymentStatus: PaymentStatus;
	amount: number;
	paymentMethod: PaymentMethod;
	paidAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	patientData?: Member;
	doctorData?: Doctor;
}

export interface Payments {
	list: Payment[];
	metaCounter: TotalCounter[];
}
