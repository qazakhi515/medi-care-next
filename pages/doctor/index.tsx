import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Pagination, MenuItem, Select, Typography } from '@mui/material';
import DoctorCard from '../../libs/components/doctor/DoctorCard';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from '@apollo/client';
import { GET_DOCTORS } from '../../apollo/user/query';
import { Doctor } from '../../libs/types/doctor/doctor';
import { Specialization } from '../../libs/enums/doctor.enum';
import { T } from '../../libs/types/common';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const DoctorList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<any>(initialInput);
	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const { loading, data: getDoctorsData } = useQuery(GET_DOCTORS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setDoctors(data?.getDoctors?.list);
			setTotal(data?.getDoctors?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
		setCurrentPage(value);
	};

	const specializationHandler = (value: string) => {
		if (value === 'ALL') {
			const { specializationList, ...rest } = searchFilter.search;
			setSearchFilter({ ...searchFilter, page: 1, search: { ...rest } });
		} else {
			setSearchFilter({
				...searchFilter,
				page: 1,
				search: { ...searchFilter.search, specializationList: [value as Specialization] },
			});
		}
		setCurrentPage(1);
	};

	if (device === 'mobile') {
		return <h1>DOCTORS PAGE MOBILE</h1>;
	}
	return (
		<Stack sx={{ maxWidth: 1200, margin: '0 auto', py: 5, px: 2 }}>
			<Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
				Our Doctors
			</Typography>
			<Stack direction="row" spacing={2} sx={{ mb: 4 }} alignItems="center">
				<Box
					component="input"
					placeholder="Search for a doctor"
					value={searchText}
					onChange={(e: any) => setSearchText(e.target.value)}
					onKeyDown={(e: any) => {
						if (e.key === 'Enter') {
							setSearchFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, text: searchText } });
						}
					}}
					sx={{ flex: 1, p: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: 14 }}
				/>
				<Select
					size="small"
					defaultValue="ALL"
					onChange={(e) => specializationHandler(e.target.value)}
					sx={{ minWidth: 200 }}
				>
					<MenuItem value="ALL">All specializations</MenuItem>
					{Object.values(Specialization).map((s) => (
						<MenuItem key={s} value={s}>
							{s}
						</MenuItem>
					))}
				</Select>
			</Stack>

			<Stack direction="row" flexWrap="wrap" gap={3} justifyContent="flex-start">
				{doctors?.length === 0 ? (
					<Stack sx={{ width: '100%', alignItems: 'center', py: 8 }}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>No Doctors found!</p>
					</Stack>
				) : (
					doctors.map((doctor: Doctor) => <DoctorCard doctor={doctor} key={doctor._id} />)
				)}
			</Stack>

			{total > 0 && (
				<Stack sx={{ mt: 5, alignItems: 'center' }} spacing={2}>
					{Math.ceil(total / searchFilter.limit) > 1 && (
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={paginationChangeHandler}
							shape="circular"
							color="primary"
						/>
					)}
					<Typography color="text.secondary">
						Total {total} doctor{total > 1 ? 's' : ''} available
					</Typography>
				</Stack>
			)}
		</Stack>
	);
};

DoctorList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(DoctorList);
