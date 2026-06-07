import { DoctorStatus, Specialization } from '../../enums/doctor.enum';

export interface DoctorUpdate {
	_id: string;
	doctorStatus?: DoctorStatus;
	specialization?: Specialization;
	licenseNumber?: string;
	experienceYears?: number;
	consultationFee?: number;
	education?: string;
	certificates?: string;
}
