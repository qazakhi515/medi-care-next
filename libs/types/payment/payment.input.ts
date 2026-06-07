import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import { Direction } from '../../enums/common.enum';

export interface PaymentInput {
	appointmentId: string;
	paymentMethod: PaymentMethod;
	amount?: number;
}

interface PayISearch {
	patientId?: string;
	doctorId?: string;
	paymentStatus?: PaymentStatus;
}

export interface PaymentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PayISearch;
}
