import { HospitalLocation, HospitalStatus, HospitalType } from '../../enums/hospital.enum';

export interface HospitalUpdate {
	_id: string;
	hospitalType?: HospitalType;
	hospitalStatus?: HospitalStatus;
	hospitalLocation?: HospitalLocation;
	hospitalAddress?: string;
	hospitalTitle?: string;
	hospitalPrice?: number;
	hospitalSquare?: number;
	hospitalBeds?: number;
	hospitalRooms?: number;
	hospitalImages?: string[];
	hospitalDesc?: string;
	hospitalBarter?: boolean;
	hospitalRent?: boolean;
	deletedAt?: Date;
	constructedAt?: Date;
}
