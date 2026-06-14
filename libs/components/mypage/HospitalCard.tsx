import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Hospital } from '../../types/hospital/hospital';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { HospitalStatus } from '../../enums/hospital.enum';

interface HospitalCardProps {
	hospital: Hospital;
	deleteHospitalHandler?: any;
	memberPage?: boolean;
	updateHospitalHandler?: any;
}

export const HospitalCard = (props: HospitalCardProps) => {
	const { hospital, deleteHospitalHandler, memberPage, updateHospitalHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditHospital = async (id: string) => {
		console.log('+pushEditHospital: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addHospital', hospitalId: id },
		});
	};

	const pushHospitalDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/hospital/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE HOSPITAL CARD</div>;
	} else
		return (
			<Stack className="hospital-card-box">
				<Stack className="image-box" onClick={() => pushHospitalDetail(hospital?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${hospital.hospitalImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushHospitalDetail(hospital?._id)}>
					<Typography className="name">{hospital.hospitalTitle}</Typography>
					<Typography className="address">{hospital.hospitalAddress}</Typography>
					<Typography className="price">
						<strong>{formatterStr(hospital?.hospitalPrice)} sum</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{hospital.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{hospital.hospitalStatus}
						</Typography>
					</Stack>
				</Stack>
				<Stack className="views-box">
					<Typography className="views">{hospital.hospitalViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && hospital.hospitalStatus === HospitalStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditHospital(hospital._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteHospitalHandler(hospital._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
