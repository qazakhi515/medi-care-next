import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { HospitalPanelList } from '../../../libs/components/admin/hospitals/HospitalList';
import { AllHospitalsInquiry } from '../../../libs/types/hospital/hospital.input';
import { Hospital } from '../../../libs/types/hospital/hospital';
import { HospitalLocation, HospitalStatus } from '../../../libs/enums/hospital.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { HospitalUpdate } from '../../../libs/types/hospital/hospital.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_HOSPITAL_BY_ADMIN, UPDATE_HOSPITAL_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_HOSPITALS_BY_ADMIN } from '../../../apollo/admin/query';
import { T } from '../../../libs/types/common';

const AdminHospitals: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [hospitalsInquiry, setHospitalsInquiry] = useState<AllHospitalsInquiry>(initialInquiry);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [hospitalsTotal, setHospitalsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		hospitalsInquiry?.search?.hospitalStatus ? hospitalsInquiry?.search?.hospitalStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const [updateHospitalByAdmin] = useMutation(UPDATE_HOSPITAL_BY_ADMIN);
	const [removeHospitalByAdmin] = useMutation(REMOVE_HOSPITAL_BY_ADMIN);

	const {
		loading: getAllHospitalsByAdminLoading,
		data: getAllHospitalsByAdminData,
		error: getAllHospitalsByAdminError,
		refetch: getAllHospitalsByAdminRefetch,
	} = useQuery(GET_ALL_HOSPITALS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: hospitalsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setHospitals(data?.getAllHospitalsByAdmin?.list);
			setHospitalsTotal(data?.getAllHospitalsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		getAllHospitalsByAdminRefetch({ input: hospitalsInquiry }).then();
	}, [hospitalsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		hospitalsInquiry.page = newPage + 1;
		await getAllHospitalsByAdminRefetch({ input: hospitalsInquiry });
		setHospitalsInquiry({ ...hospitalsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		hospitalsInquiry.limit = parseInt(event.target.value, 10);
		hospitalsInquiry.page = 1;
		await getAllHospitalsByAdminRefetch({ input: hospitalsInquiry });
		setHospitalsInquiry({ ...hospitalsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setHospitalsInquiry({ ...hospitalsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setHospitalsInquiry({ ...hospitalsInquiry, search: { hospitalStatus: HospitalStatus.ACTIVE } });
				break;
			case 'DELETE':
				setHospitalsInquiry({ ...hospitalsInquiry, search: { hospitalStatus: HospitalStatus.DELETE } });
				break;
			default:
				delete hospitalsInquiry?.search?.hospitalStatus;
				setHospitalsInquiry({ ...hospitalsInquiry });
				break;
		}
	};

	const removeHospitalHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeHospitalByAdmin({
					variables: {
						input: id,
					},
				});

				await getAllHospitalsByAdminRefetch({ input: hospitalsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setHospitalsInquiry({
					...hospitalsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...hospitalsInquiry.search,
						hospitalLocationList: [newValue as HospitalLocation],
					},
				});
			} else {
				delete hospitalsInquiry?.search?.hospitalLocationList;
				setHospitalsInquiry({ ...hospitalsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updateHospitalHandler = async (updateData: HospitalUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateHospitalByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			await getAllHospitalsByAdminRefetch({ input: hospitalsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Hospital List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(HospitalLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<HospitalPanelList
							hospitals={hospitals}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateHospitalHandler={updateHospitalHandler}
							removeHospitalHandler={removeHospitalHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={hospitalsTotal}
							rowsPerPage={hospitalsInquiry?.limit}
							page={hospitalsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminHospitals.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminHospitals);
