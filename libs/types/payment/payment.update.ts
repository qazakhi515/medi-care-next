import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';

export interface PaymentUpdate {
	_id: string;
	paymentStatus?: PaymentStatus;
	paymentMethod?: PaymentMethod;
}
