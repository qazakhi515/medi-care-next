import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Hospital } from '../../types/hospital/hospital';
import { HospitalsInquiry } from '../../types/hospital/hospital.input';
import TrendHospitalCard from './TrendHospitalCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_HOSPITALS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_HOSPITAL } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface TrendHospitalsProps {
	initialInput: HospitalsInquiry;
}

const TrendHospitals = (props: TrendHospitalsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendHospitals, setTrendHospitals] = useState<Hospital[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetHospital] = useMutation(LIKE_TARGET_HOSPITAL);

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
			setTrendHospitals(data?.getHospitals?.list);
		},
	});

	/** HANDLERS **/
	const likeHospitalHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetHospital({
				variables: { input: id },
			});

			await getHospitalsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeHospitalHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendHospitals) console.log('trendHospitals:', trendHospitals);
	if (!trendHospitals) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trend Hospitals</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendHospitals.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-hospital-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendHospitals.map((hospital: Hospital) => {
									return (
										<SwiperSlide key={hospital._id} className={'trend-hospital-slide'}>
											<TrendHospitalCard hospital={hospital} likeHospitalHandler={likeHospitalHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trend Hospitals</span>
							<p>Trend is based on likes</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendHospitals.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-hospital-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendHospitals.map((hospital: Hospital) => {
									return (
										<SwiperSlide key={hospital._id} className={'trend-hospital-slide'}>
											<TrendHospitalCard hospital={hospital} likeHospitalHandler={likeHospitalHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendHospitals.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'hospitalLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendHospitals;
