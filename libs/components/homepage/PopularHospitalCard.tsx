import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import { useRouter } from 'next/router';
import { Hospital } from '../../types/hospital/hospital';
import { REACT_APP_API_URL, topHospitalRank } from '../../config';

interface PopularHospitalCardProps {
	hospital: Hospital;
}

const PopularHospitalCard = (props: PopularHospitalCardProps) => {
	const { hospital } = props;
	const router = useRouter();

	const imagePath: string = hospital?.hospitalImages?.[0]
		? `${REACT_APP_API_URL}/${hospital.hospitalImages[0]}`
		: '/img/medi/hospital-fallback.jpg';

	/** HANDLERS **/
	const pushDetailHandler = async (hospitalId: string) => {
		await router.push({ pathname: '/hospital/detail', query: { id: hospitalId } });
	};

	return (
		<Stack className="popular-card-box">
			<Box
				component={'div'}
				className={'card-img'}
				style={{ backgroundImage: `url(${imagePath})` }}
				onClick={() => pushDetailHandler(hospital._id)}
			>
				{hospital && hospital?.hospitalRank >= topHospitalRank ? (
					<div className={'status'}>
						<img src="/img/icons/electricity.svg" alt="" />
						<span>top</span>
					</div>
				) : (
					''
				)}
			</Box>
			<Box component={'div'} className={'info'}>
				<strong className={'title'} onClick={() => pushDetailHandler(hospital._id)}>
					{hospital.hospitalTitle}
				</strong>
				<p className={'desc'}>
					<PlaceOutlinedIcon /> {hospital.hospitalAddress || hospital.hospitalLocation}
				</p>
				<div className={'options'}>
					<div>
						<KingBedOutlinedIcon />
						<span>{hospital?.hospitalBeds} beds</span>
					</div>
					<div>
						<MeetingRoomOutlinedIcon />
						<span>{hospital?.hospitalRooms} rooms</span>
					</div>
				</div>
				<Divider sx={{ mt: '15px', mb: '14px' }} />
				<div className={'bott'}>
					<span className={'view-hospital'} onClick={() => pushDetailHandler(hospital._id)}>
						View Hospital
					</span>
					<div className="view-like-box">
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{hospital?.hospitalViews}</Typography>
					</div>
				</div>
			</Box>
		</Stack>
	);
};

export default PopularHospitalCard;
