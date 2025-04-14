"use client";

import NextTopLoader from "nextjs-toploader";

export default function TopLoaderProvider() {
	return (
		<NextTopLoader
			color="#008832"
			initialPosition={0.1}
			crawlSpeed={10}
			height={4}
			crawl={true}
			showSpinner={false}
			easing="ease"
			speed={200}
			zIndex={9999}
		/>
	);
}
