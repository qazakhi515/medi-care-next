import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import ChildCareOutlinedIcon from '@mui/icons-material/ChildCareOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Doctor } from '../../types/doctor/doctor';
import { Specialization } from '../../enums/doctor.enum';
import { REACT_APP_API_URL } from '../../config';

type IconType = typeof MedicalServicesOutlinedIcon;

// Accent color per specialization (cardiology=blue, dermatology=green, surgery=olive...)
const ACCENTS: Record<string, string> = {
	[Specialization.CARDIOLOGY]: '#3f6fd1',
	[Specialization.DERMATOLOGY]: '#2e7d52',
	[Specialization.SURGERY]: '#6b7256',
	[Specialization.PEDIATRICS]: '#e08a3c',
	[Specialization.DENTISTRY]: '#2aa6b0',
	[Specialization.ORTHOPEDICS]: '#7a5cc0',
	[Specialization.OPHTHALMOLOGY]: '#c0506b',
	[Specialization.UROLOGY]: '#2f7d8a',
	[Specialization.OTHER]: '#6b7256',
};

// Floating specialty icon per specialization (concrete MUI icon type, not React.ElementType union)
const ICONS: Record<string, IconType> = {
	[Specialization.CARDIOLOGY]: MonitorHeartOutlinedIcon,
	[Specialization.DERMATOLOGY]: HealthAndSafetyOutlinedIcon,
	[Specialization.PEDIATRICS]: ChildCareOutlinedIcon,
	[Specialization.OPHTHALMOLOGY]: VisibilityOutlinedIcon,
};

// Deterministic, SSR-safe placeholder for the "Patients" stat (no real field in the model)
const stableHash = (s: string): number => {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
	return h;
};

interface DoctorCardProps {
	doctor: Doctor;
}

const DoctorCard = (props: DoctorCardProps) => {
	const { doctor } = props;
	const router = useRouter();

	const imagePath: string = doctor?.memberData?.memberImage
		? `${REACT_APP_API_URL}/${doctor?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const accent = ACCENTS[doctor?.specialization] || '#2f3327';
	const SpecIcon: IconType = ICONS[doctor?.specialization] || MedicalServicesOutlinedIcon;
	const patients = 100 + (stableHash(doctor?._id || '') % 9) * 50; // deterministic placeholder
	const name = doctor?.memberData?.memberFullName || doctor?.memberData?.memberNick || 'Doctor';

	const pushDoctorDetail = async (doctorId: string) => {
		await router.push({ pathname: '/doctor/detail', query: { id: doctorId } });
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			whileHover={{ y: -6 }}
			style={{ width: 280 }}
		>
			<div
				className="doctor-card"
				style={{ ['--accent' as string]: accent } as React.CSSProperties}
				onClick={() => pushDoctorDetail(doctor._id)}
			>
			{/* Image area */}
			<div className="dc-imgwrap">
				<div className="dc-img" style={{ backgroundImage: `url(${imagePath})` }} />

				<div className="dc-rating">
					<StarRoundedIcon style={{ fontSize: 16, color: '#f4b740' }} />
					<span>5.0</span>
				</div>

				<svg className="dc-wave" viewBox="0 0 280 60" preserveAspectRatio="none">
					<path d="M0,60 L0,38 C60,38 96,8 140,8 C184,8 220,38 280,38 L280,60 Z" fill="#fff" />
				</svg>
			</div>

			{/* Floating specialty icon */}
			<div className="dc-ficon">
				<SpecIcon style={{ fontSize: 24, color: '#fff' }} />
			</div>

			{/* Body */}
			<div className="dc-body">
				<h3 className="dc-name">{name}</h3>
				<div className="dc-spec">{(doctor?.specialization ?? '').toString()}</div>

				<div className="dc-divider" />

				<div className="dc-stats">
					<div className="dc-stat">
						<CalendarMonthOutlinedIcon className="dc-stat-icon" style={{ fontSize: 22 }} />
						<div>
							<b>{doctor?.experienceYears ?? 0}+</b>
							<small>Years Exp.</small>
						</div>
					</div>
					<div className="dc-vline" />
					<div className="dc-stat">
						<PeopleAltOutlinedIcon className="dc-stat-icon" style={{ fontSize: 22 }} />
						<div>
							<b>{patients}+</b>
							<small>Patients</small>
						</div>
					</div>
				</div>

				<div className="dc-btn">
					<span>View Profile</span>
					<span className="dc-arrow">
						<ArrowForwardRoundedIcon style={{ fontSize: 18, color: '#fff' }} />
					</span>
				</div>
			</div>

			<style jsx>{`
				.doctor-card {
					width: 280px;
					position: relative;
					border-radius: 24px;
					overflow: hidden;
					background: #fff;
					box-shadow: 0 12px 34px rgba(47, 51, 39, 0.1);
					cursor: pointer;
					transition: box-shadow 0.3s ease;
				}
				.doctor-card:hover {
					box-shadow: 0 20px 44px rgba(47, 51, 39, 0.18);
				}
				.dc-imgwrap {
					position: relative;
					height: 230px;
					overflow: hidden;
				}
				.dc-img {
					width: 100%;
					height: 100%;
					background-size: cover;
					background-position: center top;
					transition: transform 0.4s ease;
				}
				.doctor-card:hover .dc-img {
					transform: scale(1.06);
				}
				.dc-rating {
					position: absolute;
					top: 14px;
					right: 14px;
					display: flex;
					align-items: center;
					gap: 3px;
					padding: 4px 9px;
					border-radius: 999px;
					background: #fff;
					box-shadow: 0 4px 12px rgba(47, 51, 39, 0.18);
				}
				.dc-rating span {
					font-size: 13px;
					font-weight: 700;
					color: #2f3327;
					line-height: 1;
				}
				.dc-wave {
					position: absolute;
					bottom: -1px;
					left: 0;
					width: 100%;
					height: 60px;
					display: block;
					z-index: 1;
				}
				.dc-ficon {
					position: absolute;
					top: 196px;
					left: 50%;
					transform: translateX(-50%);
					width: 62px;
					height: 62px;
					border-radius: 50%;
					background: var(--accent);
					display: flex;
					align-items: center;
					justify-content: center;
					border: 5px solid #fff;
					box-shadow: 0 8px 18px rgba(47, 51, 39, 0.22);
					z-index: 3;
				}
				.dc-body {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: -1px;
					padding: 40px 20px 20px;
					background: #fff;
				}
				.dc-name {
					margin: 0;
					font-size: 21px;
					font-weight: 800;
					color: #2f3327;
					text-align: center;
				}
				.dc-spec {
					margin-top: 4px;
					font-size: 12.5px;
					font-weight: 700;
					color: var(--accent);
					text-transform: uppercase;
					letter-spacing: 0.06em;
				}
				.dc-divider {
					width: 44px;
					height: 2px;
					border-radius: 2px;
					background: #eef0ea;
					margin: 12px 0;
				}
				.dc-stats {
					display: flex;
					align-items: center;
					width: 100%;
					margin-bottom: 8px;
				}
				.dc-stat {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}
				.dc-stat :global(.dc-stat-icon) {
					color: var(--accent);
				}
				.dc-stat b {
					display: block;
					font-size: 16px;
					font-weight: 800;
					color: #2f3327;
					line-height: 1.1;
				}
				.dc-stat small {
					font-size: 11.5px;
					color: #8a8f80;
				}
				.dc-vline {
					width: 1px;
					height: 32px;
					background: #eef0ea;
				}
				.dc-btn {
					position: relative;
					width: 100%;
					margin-top: 4px;
					padding: 9px 0;
					border-radius: 999px;
					border: 1.5px solid #eef0ea;
					text-align: center;
					transition: background 0.25s ease, border-color 0.25s ease;
				}
				.dc-btn span:first-child {
					font-size: 14.5px;
					font-weight: 700;
					color: var(--accent);
				}
				.dc-btn:hover {
					background: #fafbf8;
					border-color: var(--accent);
				}
				.dc-arrow {
					position: absolute;
					right: 6px;
					top: 50%;
					transform: translateY(-50%);
					width: 34px;
					height: 34px;
					border-radius: 50%;
					background: var(--accent);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`}</style>
			</div>
		</motion.div>
	);
};

export default DoctorCard;
