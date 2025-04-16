import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setVisible(true);
		} else {
			const timer = setTimeout(() => setVisible(false), 300); // Match the duration of the fade-out animation
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!visible) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex justify-center items-center bg-black/80 transition-opacity duration-300"
			onClick={onClose}
		>
			<div
				className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full transition-transform transform duration-300 scale-95"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
				<button
					onClick={onClose}
					className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 cursor-pointer"
				>
					<IoIosClose size={30} />
				</button>
			</div>
		</div>
	);
};

export default Modal;
