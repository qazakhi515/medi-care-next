import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
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
						<span>Popular hospitals</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-hospital-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
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
	} else {
		return (
			<Stack className={'popular-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular hospitals</span>
							<p>Popularity is based on views</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/hospital'}>
									<span>See All Categories</span>
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
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
							}}
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
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
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
