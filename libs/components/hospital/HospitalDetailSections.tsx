import React, { useState } from 'react';
import { Stack, Divider } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_DOCTORS } from '../../../apollo/user/query';
import { Hospital } from '../../types/hospital/hospital';
import { Doctor } from '../../types/doctor/doctor';
import { DoctorStatus } from '../../enums/doctor.enum';
import { T } from '../../types/common';
import HospitalAbout from './HospitalAbout';
import HospitalDoctorSchedule from './HospitalDoctorSchedule';
import HospitalGallery from './HospitalGallery';
import HospitalEquipment from './HospitalEquipment';
import HospitalLocationMap from './HospitalLocationMap';

interface HospitalDetailSectionsProps {
	hospital: Hospital;
}

/**
 * HospitalDetailSections — single additive entry point appended to the hospital
 * detail page. Fetches active doctors once and renders the four new sections:
 * About Hospital, Doctor Schedule, Hospital Gallery, Address & Map.
 * Self-contained; touches no existing page logic, queries, layout or styles.
 */
const HospitalDetailSections = ({ hospital }: HospitalDetailSectionsProps) => {
	const [doctors, setDoctors] = useState<Doctor[]>([]);

	/** APOLLO REQUESTS **/
	useQuery(GET_DOCTORS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 8,
				sort: 'doctorRank',
				direction: 'DESC',
				search: { doctorStatus: DoctorStatus.ACTIVE, hospitalId: hospital?._id },
			},
		},
		skip: !hospital?._id,
		onCompleted: (data: T) => setDoctors(data?.getDoctors?.list ?? []),
	});

	if (!hospital) return null;

	return (
		<Stack sx={{ width: '100%' }}>
			<Divider sx={{ mt: 5, mb: 1, borderColor: '#e6e8df' }} />
			<HospitalAbout hospital={hospital} doctors={doctors} />
			<HospitalGallery images={hospital?.hospitalImages} title={hospital?.hospitalTitle} />
			<HospitalEquipment hospital={hospital} />
			<HospitalDoctorSchedule doctors={doctors} />
			<HospitalLocationMap hospital={hospital} />
		</Stack>
	);
};

export default HospitalDetailSections;
