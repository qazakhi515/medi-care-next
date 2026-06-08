import { DoctorStatus, Specialization } from '../../enums/doctor.enum';
import { Direction } from '../../enums/common.enum';

export interface DoctorInput {
	specialization: Specialization;
	licenseNumber: string;
	experienceYears?: number;
	consultationFee?: number;
	education?: string;
	certificates?: string;
	hospitalId?: string;
}

interface DISearch {
	doctorStatus?: DoctorStatus;
	specializationList?: Specialization[];
	hospitalId?: string;
	text?: string;
}

export interface DoctorsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: DISearch;
}

interface ADISearch {
	doctorStatus?: DoctorStatus;
}

export interface AllDoctorsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ADISearch;
}
