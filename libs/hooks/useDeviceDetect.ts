import { useEffect, useState } from 'react';

/**
 * Returns 'mobile' when either the user-agent is a mobile device OR the viewport
 * is narrow (<= 768px), and 'desktop' otherwise. Re-evaluates on window resize so
 * resizing the browser below the breakpoint switches to the mobile layout.
 * Desktop widths (> 768px) are unaffected.
 */
const MOBILE_BREAKPOINT = 768;

const useDeviceDetect = (): string => {
	const [device, setDevice] = useState('desktop');

	useEffect(() => {
		const detect = () => {
			const userAgent = navigator.userAgent;
			const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
			const isNarrow = window.innerWidth <= MOBILE_BREAKPOINT;
			setDevice(isMobileUA || isNarrow ? 'mobile' : 'desktop');
		};

		detect();
		window.addEventListener('resize', detect);
		return () => window.removeEventListener('resize', detect);
	}, []);

	return device;
};

export default useDeviceDetect;
