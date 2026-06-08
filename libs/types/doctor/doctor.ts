import { DoctorStatus, Specialization } from '../../enums/doctor.enum';
import { Member } from '../member/member';
import { Hospital, TotalCounter } from '../hospital/hospital';

export interface Doctor {
	_id: string;
	memberId: string;
	hospitalId?: string;
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
	hospitalData?: Hospital;
}

export interface Doctors {
	list: Doctor[];
	metaCounter: TotalCounter[];
}
