import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Hospital } from '../../types/hospital/hospital';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendHospitalCardProps {
	hospital: Hospital;
	likeHospitalHandler: any;
}

const TrendHospitalCard = (props: TrendHospitalCardProps) => {
	const { hospital, likeHospitalHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (hospitalId: string) => {
		console.log('hospitalId:', hospitalId);
		await router.push({ pathname: '/hospital/detail', query: { id: hospitalId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="trend-card-box" key={hospital._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${hospital?.hospitalImages[0]})` }}
					onClick={() => pushDetailHandler(hospital._id)}
				>
					<div>${hospital.hospitalPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(hospital._id)}>
						{hospital.hospitalTitle}
					</strong>
					<p className={'desc'}>{hospital.hospitalDesc ?? 'no description'}</p>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{hospital?.hospitalViews}</Typography>
							<IconButton color={'default'}>
								{hospital?.meLiked && hospital?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{hospital?.hospitalLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={hospital._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${hospital?.hospitalImages[0]})` }}
					onClick={() => pushDetailHandler(hospital._id)}
				>
					<div>${hospital.hospitalPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(hospital._id)}>
						{hospital.hospitalTitle}
					</strong>
					<p className={'desc'}>{hospital.hospitalDesc ?? 'no description'}</p>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{hospital?.hospitalViews}</Typography>
							<IconButton color={'default'}>
								{hospital?.meLiked && hospital?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{hospital?.hospitalLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendHospitalCard;
