import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'medi-care, medicare, hospital, doctor, appointment, healthcare platform'} />
				<meta
					name={'description'}
					content={
						'Find hospitals and doctors and book appointments anywhere anytime in South Korea. Quality healthcare at Medi-care | ' +
						'Найдите больницы и врачей и записывайтесь на приём в любой точке Южной Кореи в любое время на Medi-care | ' +
						'대한민국 언제 어디서나 병원과 의사를 찾아 진료를 예약하세요. Medi-care에서 최고의 의료 서비스를 만나보세요'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
