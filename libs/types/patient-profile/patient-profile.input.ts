import { BloodType, Gender } from '../../enums/patient-profile.enum';
import { Direction } from '../../enums/common.enum';

export interface PatientProfileInput {
	birthDate?: Date;
	gender?: Gender;
	bloodType?: BloodType;
	chronicDiseases?: string;
	emergencyContact?: string;
}

export interface PatientProfileUpdate {
	birthDate?: Date;
	gender?: Gender;
	bloodType?: BloodType;
	chronicDiseases?: string;
	emergencyContact?: string;
}

interface PPISearch {
	gender?: Gender;
	bloodType?: BloodType;
}

export interface PatientProfilesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PPISearch;
}
