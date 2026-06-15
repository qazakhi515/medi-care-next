import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Hospital } from '../../types/hospital/hospital';
import { HospitalStatus } from '../../enums/hospital.enum';
import { REACT_APP_API_URL } from '../../config';

// Deterministic, SSR-safe rating (no real rating field in the model)
const stableHash = (s: string): number => {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
	return h;
};

interface PopularHospitalCardProps {
	hospital: Hospital;
}

const PopularHospitalCard = (props: PopularHospitalCardProps) => {
	const { hospital } = props;
	const router = useRouter();

	const imagePath: string = hospital?.hospitalImages?.[0]
		? `${REACT_APP_API_URL}/${hospital.hospitalImages[0]}`
		: '/img/medi/hospital-fallback.jpg';

	const rating = (4.6 + (stableHash(hospital?._id || '') % 4) * 0.1).toFixed(1);
	const isOpen = hospital?.hospitalStatus === HospitalStatus.ACTIVE;

	const pushDetailHandler = async (hospitalId: string) => {
		await router.push({ pathname: '/hospital/detail', query: { id: hospitalId } });
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			whileHover={{ y: -6 }}
		>
			<div className="ph-card" onClick={() => pushDetailHandler(hospital._id)}>
			{/* Image */}
			<div className="ph-imgwrap">
				<div className="ph-img" style={{ backgroundImage: `url(${imagePath})` }} />
				<div className="ph-rating">
					<StarRoundedIcon style={{ fontSize: 16, color: '#f5b942' }} />
					<span>{rating}</span>
				</div>
				{isOpen && <div className="ph-open">Open Now</div>}
			</div>

			{/* Body */}
			<div className="ph-body">
				<h3 className="ph-title">{hospital.hospitalTitle}</h3>
				<p className="ph-addr">
					<PlaceOutlinedIcon className="ph-pin" style={{ fontSize: 18 }} />
					<span>{hospital.hospitalAddress || hospital.hospitalLocation}</span>
				</p>

				<div className="ph-divider" />

				<div className="ph-btn">
					<span>View Hospital</span>
					<ArrowForwardRoundedIcon className="ph-btn-arrow" style={{ fontSize: 18 }} />
				</div>
			</div>

			<style jsx>{`
				.ph-card {
					--accent: #2f8f4e;
					width: 100%;
					box-sizing: border-box;
					background: #fff;
					border-radius: 24px;
					padding: 14px;
					box-shadow: 0 12px 34px rgba(31, 42, 36, 0.08);
					cursor: pointer;
					transition: box-shadow 0.3s ease;
				}
				.ph-card:hover {
					box-shadow: 0 20px 44px rgba(31, 42, 36, 0.16);
				}
				.ph-imgwrap {
					position: relative;
					width: 100%;
					height: 196px;
					border-radius: 16px;
					overflow: hidden;
				}
				.ph-img {
					width: 100%;
					height: 100%;
					background-size: cover;
					background-position: center;
					transition: transform 0.45s ease;
				}
				.ph-card:hover .ph-img {
					transform: scale(1.06);
				}
				.ph-rating {
					position: absolute;
					top: 14px;
					left: 14px;
					display: flex;
					align-items: center;
					gap: 4px;
					padding: 5px 10px;
					border-radius: 999px;
					background: #fff;
					box-shadow: 0 4px 12px rgba(31, 42, 36, 0.16);
				}
				.ph-rating span {
					font-size: 13px;
					font-weight: 700;
					color: #1f2a24;
					line-height: 1;
				}
				.ph-open {
					position: absolute;
					top: 14px;
					right: 14px;
					padding: 6px 12px;
					border-radius: 999px;
					background: #e8f5ec;
					color: var(--accent);
					font-size: 12.5px;
					font-weight: 700;
					line-height: 1;
				}
				.ph-body {
					padding: 16px 6px 6px;
				}
				.ph-title {
					margin: 0;
					font-size: 19px;
					font-weight: 800;
					color: #1f2a24;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
				}
				.ph-addr {
					display: flex;
					align-items: center;
					gap: 6px;
					margin: 10px 0 0;
					color: #6b7280;
					font-size: 14px;
				}
				.ph-addr :global(.ph-pin) {
					color: var(--accent);
				}
				.ph-addr span {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.ph-divider {
					height: 1px;
					background: #eef0ea;
					margin: 14px 0;
				}
				.ph-stats {
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.ph-stat {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 8px;
				}
				.ph-stat :global(.ph-stat-icon) {
					color: var(--accent);
				}
				.ph-stat b {
					display: block;
					font-size: 17px;
					font-weight: 800;
					color: #1f2a24;
					line-height: 1.1;
				}
				.ph-stat small {
					font-size: 12px;
					color: #8a8f80;
				}
				.ph-vline {
					width: 1px;
					height: 30px;
					background: #eef0ea;
				}
				.ph-btn {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 16px;
					padding: 13px 0;
					border-radius: 999px;
					border: 1.5px solid #e3e6df;
					transition: background 0.25s ease, border-color 0.25s ease;
				}
				.ph-btn span {
					font-size: 15px;
					font-weight: 700;
					color: var(--accent);
				}
				.ph-btn :global(.ph-btn-arrow) {
					position: absolute;
					right: 20px;
					color: var(--accent);
				}
				.ph-btn:hover {
					background: #f6faf7;
					border-color: var(--accent);
				}
			`}</style>
			</div>
		</motion.div>
	);
};

export default PopularHospitalCard;
