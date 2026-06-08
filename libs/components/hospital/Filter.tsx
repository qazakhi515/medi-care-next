import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { HospitalLocation, HospitalType } from '../../enums/hospital.enum';
import { HospitalsInquiry } from '../../types/hospital/hospital.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

interface FilterType {
	searchFilter: HospitalsInquiry;
	setSearchFilter: any;
	initialInput: HospitalsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [hospitalLocation] = useState<HospitalLocation[]>(Object.values(HospitalLocation));
	const [hospitalType] = useState<HospitalType[]>(Object.values(HospitalType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router
				.push(
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: { ...searchFilter.search } })}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const hospitalLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/hospital?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/hospital?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/hospital?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/hospital?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
				console.log('hospitalLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, hospitalLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const hospitalTypeSelectHandler = useCallback(
		async (value: string) => {
			try {
				let nextSearch: any = { ...searchFilter.search };
				if (value === 'ALL') {
					delete nextSearch.typeList;
				} else {
					nextSearch = { ...nextSearch, typeList: [value as HospitalType] };
				}
				await router.push(
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: nextSearch })}`,
					`/hospital?input=${JSON.stringify({ ...searchFilter, search: nextSearch })}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, hospitalTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(`/hospital?input=${JSON.stringify(initialInput)}`, `/hospital?input=${JSON.stringify(initialInput)}`, {
				scroll: false,
			});
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HOSPITALS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Hospital</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title shadow-title'}>Location</p>
					<Stack
						className={`hospital-location ${showMore ? 'expanded' : ''}`}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{hospitalLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="hospital-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as HospitalLocation)}
										onChange={hospitalLocationSelectHandler}
									/>
									<label htmlFor={location} className={'clickable-label'}>
										<Typography className="hospital-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<FormControl fullWidth size="small">
						<InputLabel id="hospital-type-label">Hospital type</InputLabel>
						<Select
							labelId="hospital-type-label"
							label="Hospital type"
							value={searchFilter?.search?.typeList?.[0] ?? 'ALL'}
							onChange={(e) => hospitalTypeSelectHandler(e.target.value as string)}
						>
							<MenuItem value="ALL">All types</MenuItem>
							{hospitalType.map((type: string) => (
								<MenuItem value={type} key={type}>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
