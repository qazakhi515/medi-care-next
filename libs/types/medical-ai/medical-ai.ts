import { MedicalAiUrgencyLevel } from '../../enums/medical-ai.enum';
import { Specialization } from '../../enums/doctor.enum';

export interface MedicalAiAnswer {
	answer: string;
	urgencyLevel: MedicalAiUrgencyLevel;
	suggestedSpecialization?: Specialization;
	shouldBookAppointment: boolean;
	safetyNotice: string;
}
