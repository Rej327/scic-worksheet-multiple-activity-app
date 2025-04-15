import React from "react";

export default function SpinnerLoading() {
	return (
		<div className="text-center py-8 text-green-600">
			<div
				className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-green-600 rounded-full"
				role="status"
			>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
