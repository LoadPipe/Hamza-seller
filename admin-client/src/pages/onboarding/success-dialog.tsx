import React from 'react';

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToDashboard: () => void; 
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({
    isOpen,
    onGoToDashboard,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-black text-white p-6 rounded-md max-w-sm w-full relative">
                <div className="flex justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-[#94D42A]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-center mb-2">
                    Submitted Successfully
                </h2>
                <p className="text-sm text-center mb-6">
                    Your application has been submitted. You can now access your
                    seller dashboard and start setting up your store. Welcome
                    aboard!
                </p>

                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={onGoToDashboard}
                        className="bg-[#94D42A] text-black font-semibold px-4 py-2 rounded-full w-full w-1/2"
                    >
                        Go to dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessDialog;
