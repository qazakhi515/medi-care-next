import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { HospitalCard } from '../mypage/HospitalCard';
import { Hospital } from '../../types/hospital/hospital';
import { HospitalsInquiry } from '../../types/hospital/hospital.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { GET_HOSPITALS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';

const MyHospitals: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<HospitalsInquiry>({ ...initialInput });
	const [agentHospitals, setAgentHospitals] = useState<Hospital[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getHospitalsLoading,
		data: getHospitalsData,
		error: getHospitalsError,
		refetch: getHospitalsRefetch,
	} = useQuery(GET_HOSPITALS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentHospitals(data?.getHospitals?.list);
			setTotal(data?.getHospitals?.metaCounter?.[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		getHospitalsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>MEDI-CARE HOSPITALS MOBILE</div>;
	} else {
		return (
			<div id="member-hospitals-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Hospitals</Typography>
					</Stack>
				</Stack>
				<Stack className="hospitals-list-box">
					<Stack className="list-box">
						{agentHospitals?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{agentHospitals?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Hospital found!</p>
							</div>
						)}
						{agentHospitals?.map((hospital: Hospital) => {
							return <HospitalCard hospital={hospital} memberPage={true} key={hospital?._id} />;
						})}

						{agentHospitals.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} hospital available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyHospitals.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MyHospitals;
