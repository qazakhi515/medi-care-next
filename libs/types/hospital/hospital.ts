import { HospitalLocation, HospitalStatus, HospitalType } from '../../enums/hospital.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Hospital {
	_id: string;
	hospitalType: HospitalType;
	hospitalStatus: HospitalStatus;
	hospitalLocation: HospitalLocation;
	hospitalAddress: string;
	hospitalTitle: string;
	hospitalPrice: number;
	hospitalSquare: number;
	hospitalBeds: number;
	hospitalRooms: number;
	hospitalViews: number;
	hospitalLikes: number;
	hospitalComments: number;
	hospitalRank: number;
	hospitalImages: string[];
	hospitalDesc?: string;
	hospitalBarter: boolean;
	hospitalRent: boolean;
	memberId: string;
	deletedAt?: Date;
	constructedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Hospitals {
	list: Hospital[];
	metaCounter: TotalCounter[];
}
