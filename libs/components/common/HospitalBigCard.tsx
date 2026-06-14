import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Hospital } from '../../types/hospital/hospital';
import { REACT_APP_API_URL, topHospitalRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface HospitalBigCardProps {
	hospital: Hospital;
	likeHospitalHandler?: any;
}

const HospitalBigCard = (props: HospitalBigCardProps) => {
	const { hospital, likeHospitalHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goHospitalDetatilPage = (hospitalId: string) => {
		router.push(`/hospital/detail?id=${hospitalId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="hospital-big-card-box" onClick={() => goHospitalDetatilPage(hospital?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${hospital?.hospitalImages?.[0]})` }}
				>
					{hospital && hospital?.hospitalRank >= topHospitalRank && (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					)}

					<div className={'price'}>${formatterStr(hospital?.hospitalPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{hospital?.hospitalTitle}</strong>
					<p className={'desc'}>{hospital?.hospitalAddress}</p>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{hospital?.hospitalViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									e.stopPropagation();
									if (typeof likeHospitalHandler === 'function') likeHospitalHandler(user, hospital?._id);
								}}
							>
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

export default HospitalBigCard;
