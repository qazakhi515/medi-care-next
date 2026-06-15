import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import PopularHospitalCard from './PopularHospitalCard';
import { Hospital } from '../../types/hospital/hospital';
import Link from 'next/link';
import { HospitalsInquiry } from '../../types/hospital/hospital.input';
import { useQuery } from '@apollo/client';
import { GET_HOSPITALS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface PopularHospitalsProps {
	initialInput: HospitalsInquiry;
}

const PopularHospitals = (props: PopularHospitalsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularHospitals, setPopularHospitals] = useState<Hospital[]>([]);

	/** APOLLO REQUESTS **/

	const {
		loading: getHospitalsLoading,
		data: getHospitalsData,
		error: getHospitalsError,
		refetch: getHospitalsRefetch,
	} = useQuery(GET_HOSPITALS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPopularHospitals(data?.getHospitals?.list);
		},
	});
	/** HANDLERS **/

	if (!popularHospitals) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular Hospitals</span>
					</Stack>
					<Stack className={'card-box'}>
						<div className={'m-scroll-row'}>
							{popularHospitals.slice(0, 4).map((hospital: Hospital) => {
								return (
									<div className={'m-scroll-item'} key={hospital._id}>
										<PopularHospitalCard hospital={hospital} />
									</div>
								);
							})}
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Hospitals</span>
							<p>Most visited hospitals on Medi-care</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/hospital'}>
									<span>See All Hospitals</span>
								</Link>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-hospital-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularHospitals.map((hospital: Hospital) => {
								return (
									<SwiperSlide key={hospital._id} className={'popular-hospital-slide'}>
										<PopularHospitalCard hospital={hospital} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularHospitals.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'hospitalViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularHospitals;
