"use client";

import { clearStorage } from "@/utils/inputsData";
import { ReactNode, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	isSetVisible?: boolean; // Changed to optional prop to match usage in Home component
}

export default function TodoModal({
	isOpen,
	onClose,
	title,
	children,
	size = "md",
	isSetVisible = false, // Default value to handle optional prop
}: ModalProps) {
	const [isRendered, setIsRendered] = useState(false);
	const [isVisible, setIsVisible] = useState(false); // Added missing state variable

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (isOpen) {
			// First render the component
			setIsRendered(true);
			// Then trigger the transition after a small delay
			timeoutId = setTimeout(() => {
				setIsVisible(isSetVisible);
			}, 10);
		} else if (!isOpen && isVisible) {
			// First make it invisible (triggers transition)
			setIsVisible(false);
			// Then unmount after transition completes
			timeoutId = setTimeout(() => {
				setIsRendered(false);
			}, 300);
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isOpen, isVisible]);

	const handleClose = () => {
		clearStorage();
		onClose();
	};

	if (!isRendered) return null;

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${
				isVisible ? "bg-black/80" : "bg-none"
			} ${!isVisible && "pointer-events-none"}`}
		>
			<div
				className={`bg-white rounded-lg shadow-xl w-full ${
					sizeClasses[size]
				} max-h-[90vh] flex flex-col transition-all duration-300 ease-in-out ${
					isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-4 border-b border-gray-300 shadow">
					<h3 className="text-lg font-medium text-green-950">
						{title}
					</h3>
				</div>
				<div className="p-4 overflow-y-auto flex-grow">{children}</div>
			</div>
		</div>
	);
}
