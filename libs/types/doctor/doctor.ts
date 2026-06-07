import { DoctorStatus, Specialization } from '../../enums/doctor.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../hospital/hospital';

export interface Doctor {
	_id: string;
	memberId: string;
	doctorStatus: DoctorStatus;
	specialization: Specialization;
	licenseNumber: string;
	experienceYears: number;
	consultationFee: number;
	education?: string;
	certificates?: string;
	doctorRank: number;
	doctorViews: number;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface Doctors {
	list: Doctor[];
	metaCounter: TotalCounter[];
}
