import { BloodType, Gender } from '../../enums/patient-profile.enum';
import { Member } from '../member/member';
import { TotalCounter } from '../hospital/hospital';

export interface PatientProfile {
	_id: string;
	memberId: string;
	birthDate?: Date;
	gender?: Gender;
	bloodType?: BloodType;
	chronicDiseases?: string;
	emergencyContact?: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	memberData?: Member;
}

export interface PatientProfiles {
	list: PatientProfile[];
	metaCounter: TotalCounter[];
}
