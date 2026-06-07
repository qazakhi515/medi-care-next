import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { HospitalCard } from './HospitalCard';
import { Hospital } from '../../types/hospital/hospital';
import { AgentHospitalsInquiry } from '../../types/hospital/hospital.input';
import { T } from '../../types/common';
import { HospitalStatus } from '../../enums/hospital.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { UPDATE_HOSPITAL } from '../../../apollo/user/mutation';
import { GET_AGENT_HOSPITALS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyHospitals: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentHospitalsInquiry>(initialInput);
	const [agentHospitals, setAgentHospitals] = useState<Hospital[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateHospital] = useMutation(UPDATE_HOSPITAL);

	const {
		loading: getAgentHospitalsLoading,
		data: getAgentHospitalsData,
		error: getAgentHospitalsError,
		refetch: getAgentHospitalsRefetch,
	} = useQuery(GET_AGENT_HOSPITALS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentHospitals(data?.getAgentHospitals?.list);
			setTotal(data?.getAgentHospitals?.metaCounter[0]?.total ?? 0);
		},
	});
	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: HospitalStatus) => {
		setSearchFilter({ ...searchFilter, search: { hospitalStatus: value } });
	};

	const deleteHospitalHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('are you sure to delete this hospital?')) {
				await updateHospital({
					variables: {
						input: {
							_id: id,
							hospitalStatus: 'DELETE',
						},
					},
				});

				await getAgentHospitalsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};
	const updateHospitalHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`are you sure change to ${status} status?`)) {
				await updateHospital({
					variables: {
						input: {
							_id: id,
							hospitalStatus: status,
						},
					},
				});
				await getAgentHospitalsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};
	if (user?.memberType !== 'DOCTOR') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>NESTAR HOSPITALS MOBILE</div>;
	} else {
		return (
			<div id="my-hospital-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Hospitals</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="hospital-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(HospitalStatus.ACTIVE)}
							className={searchFilter.search.hospitalStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Active
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.hospitalStatus === 'ACTIVE' && (
								<Typography className="title-text">Action</Typography>
							)}
						</Stack>

						{agentHospitals?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Hospital found!</p>
							</div>
						) : (
							agentHospitals.map((hospital: Hospital) => {
								return (
									<HospitalCard
										hospital={hospital}
										deleteHospitalHandler={deleteHospitalHandler}
										updateHospitalHandler={updateHospitalHandler}
									/>
								);
							})
						)}

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
			hospitalStatus: 'ACTIVE',
		},
	},
};

export default MyHospitals;
