import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopHospitalCard from './TopHospitalCard';
import { HospitalsInquiry } from '../../types/hospital/hospital.input';
import { Hospital } from '../../types/hospital/hospital';
import { useMutation, useQuery } from '@apollo/client';
import { GET_HOSPITALS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { LIKE_TARGET_HOSPITAL } from '../../../apollo/user/mutation';

interface TopHospitalsProps {
	initialInput: HospitalsInquiry;
}

const TopHospitals = (props: TopHospitalsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topHospitals, setTopHospitals] = useState<Hospital[]>([]);

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
			setTopHospitals(data?.getHospitals?.list);
		},
	});
	/** HANDLERS **/
	const likeHospitalHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);
			await likeTargetHospital({
				variables: { input: id },
			});

			await getHospitalsRefetch({ input: initialInput });
			// execute likeTargetHospital Mutation
			// execute getHospitalsRefetch

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeHospitalHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'top-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top hospitals</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-hospital-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topHospitals.map((hospital: Hospital) => {
								return (
									<SwiperSlide className={'top-hospital-slide'} key={hospital?._id}>
										<TopHospitalCard hospital={hospital} likeHospitalHandler={likeHospitalHandler} />
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
			<Stack className={'top-hospitals'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Top hospitals</span>
							<p>Check out our Top Hospitals</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-hospital-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
							}}
						>
							{topHospitals.map((hospital: Hospital) => {
								return (
									<SwiperSlide className={'top-hospital-slide'} key={hospital?._id}>
										<TopHospitalCard hospital={hospital} likeHospitalHandler={likeHospitalHandler} />
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

TopHospitals.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'hospitalRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopHospitals;
