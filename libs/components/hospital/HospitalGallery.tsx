import React, { useEffect, useRef } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import { motion, useMotionValue, animate } from 'framer-motion';
import { REACT_APP_API_URL } from '../../config';

interface HospitalGalleryProps {
	images?: string[];
	title?: string;
}

/**
 * HospitalGallery — additive section for the hospital detail page.
 * Horizontal framer-motion gallery over the uploaded hospital images:
 * auto-slides every 4 seconds and also supports mouse drag / touch swipe.
 * Responsive, purely additive.
 */
const HospitalGallery = ({ images = [], title }: HospitalGalleryProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const list = (images ?? []).filter(Boolean);

	/** auto-slide every 4s (drag uses the same motion value, so it stays in sync) */
	useEffect(() => {
		if (list.length <= 1) return;
		const id = setInterval(() => {
			const containerW = containerRef.current?.offsetWidth ?? 0;
			const trackW = trackRef.current?.scrollWidth ?? 0;
			const maxScroll = Math.max(0, trackW - containerW);
			if (maxScroll <= 0) return;

			let next = x.get() - containerW * 0.8;
			if (Math.abs(next) > maxScroll) next = 0; // wrap to start
			animate(x, next, { duration: 0.8, ease: 'easeInOut' });
		}, 4000);
		return () => clearInterval(id);
	}, [list.length, x]);

	return (
		<Stack sx={{ mt: 4 }}>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
				<CollectionsOutlinedIcon sx={{ color: '#6b7256' }} />
				<Typography sx={{ fontSize: 22, fontWeight: 600, color: '#2f3327' }}>Hospital Gallery</Typography>
			</Stack>
			<Typography sx={{ fontSize: 14, color: '#707663', mb: 2 }}>
				Auto-sliding — drag or swipe to explore {title || 'the hospital'}
			</Typography>

			{list.length === 0 ? (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: 180,
						border: '1px dashed #e6e8df',
						borderRadius: 16,
						color: '#707663',
						fontSize: 15,
					}}
				>
					No gallery images uploaded yet
				</div>
			) : (
				<div
					ref={containerRef}
					style={{ overflow: 'hidden', borderRadius: 16, cursor: 'grab' }}
				>
					<motion.div
						ref={trackRef}
						drag="x"
						dragConstraints={containerRef}
						dragElastic={0.12}
						style={{ x, display: 'flex', gap: 16, width: 'max-content' }}
					>
						{list.map((img, idx) => (
							<Box
								key={`${img}-${idx}`}
								component={motion.div}
								whileHover={{ scale: 1.015 }}
								sx={{
									position: 'relative',
									flex: '0 0 auto',
									width: { xs: 240, sm: 320, md: 380 },
									height: { xs: 180, sm: 230, md: 260 },
									borderRadius: '14px',
									overflow: 'hidden',
									backgroundColor: '#eef0e9',
								}}
							>
								<Box
									component="img"
									src={`${REACT_APP_API_URL}/${img}`}
									alt={`hospital-gallery-${idx + 1}`}
									draggable={false}
									sx={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
								/>
							</Box>
						))}
					</motion.div>
				</div>
			)}
		</Stack>
	);
};

export default HospitalGallery;
