import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import HospitalCard from '../../libs/components/hospital/HospitalCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/hospital/Filter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HospitalsInquiry } from '../../libs/types/hospital/hospital.input';
import { Hospital } from '../../libs/types/hospital/hospital';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_HOSPITALS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_HOSPITAL } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const HospitalList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] = useState<HospitalsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [hospitals, setHospitals] = useState<Hospital[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

	/** APOLLO REQUESTS **/

	const [likeTargetHospital] = useMutation(LIKE_TARGET_HOSPITAL);

	const {
		loading: getHospitalsLoading,
		data: getHospitalsData,
		error: getHospitalsError,
		refetch: getHospitalsRefetch,
	} = useQuery(GET_HOSPITALS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setHospitals(data?.getHospitals?.list);
			setTotal(data?.getHospitals?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('+++++++++++', searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/hospital?input=${JSON.stringify(searchFilter)}`,
			`/hospital?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeHospitalHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetHospital({
				variables: { input: id },
			});

			await getHospitalsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeHospitalHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'hospitalPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'hospitalPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<div id="hospital-list-page" className="mobile">
				<div className="m-container">
					<div className="m-toolbar">
						<button
							type="button"
							className={`m-filter-toggle ${mobileFilterOpen ? 'active' : ''}`}
							onClick={() => setMobileFilterOpen((prev) => !prev)}
						>
							<TuneRoundedIcon fontSize="small" />
							<span>Filters</span>
						</button>
						<div className="m-sort">
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
									New
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'lowest'} disableRipple>
									Lowest Price
								</MenuItem>
								<MenuItem onClick={sortingHandler} id={'highest'} disableRipple>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</div>

					{mobileFilterOpen && (
						<div className="m-filter">
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</div>
					)}

					<div className="m-list">
						{hospitals?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Hospitals found!</p>
							</div>
						) : (
							hospitals.map((hospital: Hospital) => {
								const imagePath: string = hospital?.hospitalImages?.[0]
									? `${REACT_APP_API_URL}/${hospital?.hospitalImages[0]}`
									: '/img/banner/header1.svg';
								const liked = hospital?.meLiked && hospital?.meLiked[0]?.myFavorite;
								return (
									<div className="m-card" key={hospital?._id}>
										<Link href={{ pathname: '/hospital/detail', query: { id: hospital?._id } }}>
											<div className="m-card-img">
												<img src={imagePath} alt={hospital?.hospitalTitle} />
												<span className="m-price">{formatterStr(hospital?.hospitalPrice)} sum</span>
											</div>
										</Link>
										<div className="m-card-body">
											<Link href={{ pathname: '/hospital/detail', query: { id: hospital?._id } }}>
												<p className="m-title">{hospital?.hospitalTitle}</p>
											</Link>
											<p className="m-address">
												{hospital?.hospitalAddress}, {hospital?.hospitalLocation}
											</p>
											<div className="m-divider" />
											<div className="m-meta">
												<span className="m-stat">
													<RemoveRedEyeIcon fontSize="small" /> {hospital?.hospitalViews}
												</span>
												<span
													className="m-stat clickable"
													onClick={() => likeHospitalHandler(user, hospital?._id)}
												>
													{liked ? (
														<FavoriteIcon color="primary" fontSize="small" />
													) : (
														<FavoriteBorderIcon fontSize="small" />
													)}{' '}
													{hospital?.hospitalLikes}
												</span>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>

					{hospitals.length !== 0 && (
						<div className="m-pagination">
							<Pagination
								page={currentPage}
								count={Math.ceil(total / searchFilter.limit)}
								onChange={handlePaginationChange}
								shape="circular"
								color="primary"
								size="small"
							/>
							<Typography className="m-total">
								Total {total} hospital{total > 1 ? 's' : ''} available
							</Typography>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return (
			<div id="hospital-list-page">
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'hospital-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{hospitals?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Hospitals found!</p>
									</div>
								) : (
									hospitals.map((hospital: Hospital) => {
										return (
											<HospitalCard hospital={hospital} likeHospitalHandler={likeHospitalHandler} key={hospital?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{hospitals.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{hospitals.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} hospital{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

HospitalList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(HospitalList);
