import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AnimatedAppointmentIcon from '../common/AnimatedAppointmentIcon';

/**
 * MediHero — calm, clinic-style homepage hero.
 * Replaces the inherited three.js image-scroller + real-estate HeaderFilter.
 * Communicates Medi-care, hospitals, doctors and appointment booking in the first viewport.
 */
const MediHero = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [keyword, setKeyword] = useState<string>('');

	/** HANDLERS **/
	const pushSearchHandler = async () => {
		try {
			const input = {
				page: 1,
				limit: 9,
				search: keyword.trim() ? { text: keyword.trim() } : {},
			};
			await router.push(`/hospital?input=${JSON.stringify(input)}`, `/hospital?input=${JSON.stringify(input)}`);
		} catch (err) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	return (
		<Stack className={'medi-hero'}>
			<Box component={'div'} className={'hero-overlay'} />
			<Stack className={'hero-inner'}>
				<Box component={'div'} className={'hero-content'}>
					<span className={'eyebrow'}>{t('Medi-care')}</span>
					<h1>
						Quality care, <br />
						close to home.
					</h1>
					<p>
						Find trusted hospitals, meet experienced doctors and book your appointment — all in one calm,
						reassuring place.
					</p>

					<Box component={'div'} className={'hero-search'}>
						<SearchIcon className={'lead-icon'} />
						<input
							type={'text'}
							value={keyword}
							placeholder={'Search hospitals by name or city…'}
							onChange={(e) => setKeyword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') pushSearchHandler();
							}}
						/>
						<button onClick={pushSearchHandler}>Search</button>
					</Box>

					<Box component={'div'} className={'hero-actions'}>
						<button className={'primary'} onClick={() => router.push('/hospital')}>
							<LocalHospitalOutlinedIcon /> Find a Hospital
						</button>
						<button className={'ghost'} onClick={() => router.push('/appointment')}>
							<AnimatedAppointmentIcon /> Book Appointment
						</button>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default MediHero;
