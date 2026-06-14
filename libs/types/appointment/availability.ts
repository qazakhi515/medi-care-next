export interface TimeSlot {
	startTime: string;
	endTime: string;
}

export interface DoctorAvailability {
	doctorId: string;
	date: Date;
	isWorkingDay: boolean;
	slots: TimeSlot[];
}
