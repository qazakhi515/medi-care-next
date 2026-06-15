import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { useQuery } from '@apollo/client';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import DoctorCard from '../doctor/DoctorCard';
import { Doctor } from '../../types/doctor/doctor';
import { DoctorsInquiry } from '../../types/doctor/doctor.input';
import { GET_DOCTORS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface FamousDoctorsProps {
	initialInput: DoctorsInquiry;
}

/**
 * FamousDoctors — clinic homepage section surfacing experienced doctors.
 * Uses the existing GET_DOCTORS query + DoctorCard (links to /doctor/detail).
 */
const FamousDoctors = (props: FamousDoctorsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [famousDoctors, setFamousDoctors] = useState<Doctor[]>([]);

	/** APOLLO REQUESTS **/
	useQuery(GET_DOCTORS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setFamousDoctors(data?.getDoctors?.list || []);
		},
	});

	const cards = famousDoctors.map((doctor: Doctor) => (
		<SwiperSlide key={doctor._id} className={'famous-doctor-slide'}>
			<DoctorCard doctor={doctor} />
		</SwiperSlide>
	));

	if (device === 'mobile') {
		return (
			<Stack className={'famous-doctors'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Famous Doctors</span>
					</Stack>
					<Stack className={'card-box'}>
						{famousDoctors.length === 0 ? (
							<div className={'empty-list'}>No doctors to show yet</div>
						) : (
							<Swiper
								className={'famous-doctor-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={24}
								modules={[Autoplay]}
							>
								{cards}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}

	return (
		<Stack className={'famous-doctors'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>Famous Doctors</span>
						<p>Experienced specialists ready to care for you</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'more-box'}>
							<Link href={'/doctor'}>
								<span>See All Doctors</span>
							</Link>
							<img src="/img/icons/rightup.svg" alt="" />
						</div>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					{famousDoctors.length === 0 ? (
						<div className={'empty-list'}>No doctors to show yet</div>
					) : (
						<Swiper
							className={'famous-doctor-swiper'}
							slidesPerView={'auto'}
							spaceBetween={28}
							modules={[Autoplay]}
						>
							{cards}
						</Swiper>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

FamousDoctors.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'doctorViews',
		direction: 'DESC',
		search: {},
	},
};

export default FamousDoctors;
