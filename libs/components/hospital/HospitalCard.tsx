import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Hospital } from '../../types/hospital/hospital';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topHospitalRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface HospitalCardType {
	hospital: Hospital;
	likeHospitalHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const HospitalCard = (props: HospitalCardType) => {
	const { hospital, likeHospitalHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = hospital?.hospitalImages[0]
		? `${REACT_APP_API_URL}/${hospital?.hospitalImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>HOSPITAL CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/hospital/detail',
							query: { id: hospital?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{hospital && hospital?.hospitalRank > topHospitalRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>{formatterStr(hospital?.hospitalPrice)} sum</Typography>
					</Box>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/hospital/detail',
									query: { id: hospital?._id },
								}}
							>
								<Typography>{hospital.hospitalTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{hospital.hospitalAddress}, {hospital.hospitalLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{hospital?.hospitalViews}</Typography>
								<IconButton
									color={'default'}
									onClick={() => typeof likeHospitalHandler === 'function' && likeHospitalHandler(user, hospital?._id)}
								>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : hospital?.meLiked && hospital?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{hospital?.hospitalLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default HospitalCard;
