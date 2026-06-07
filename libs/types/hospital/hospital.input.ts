import { HospitalLocation, HospitalStatus, HospitalType } from '../../enums/hospital.enum';
import { Direction } from '../../enums/common.enum';

export interface HospitalInput {
	hospitalType: HospitalType;
	hospitalLocation: HospitalLocation;
	hospitalAddress: string;
	hospitalTitle: string;
	hospitalPrice: number;
	hospitalSquare: number;
	hospitalBeds: number;
	hospitalRooms: number;
	hospitalImages: string[];
	hospitalDesc?: string;
	hospitalBarter?: boolean;
	hospitalRent?: boolean;
	memberId?: string;
	constructedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: HospitalLocation[];
	typeList?: HospitalType[];
	roomsList?: Number[];
	options?: string[];
	bedsList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	squaresRange?: Range;
	text?: string;
}

export interface HospitalsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	hospitalStatus?: HospitalStatus;
}

export interface AgentHospitalsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	hospitalStatus?: HospitalStatus;
	hospitalLocationList?: HospitalLocation[];
}

export interface AllHospitalsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
