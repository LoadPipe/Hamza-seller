import React from 'react';

interface WelcomeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            role="dialog"
            aria-modal="true"
        >
            {/* Dialog container */}
            <div className="bg-black text-white pt-10 pr-6 pb-10 pl-6 rounded-[12px] max-w-md w-full text-center flex flex-col items-center justify-center space-y-7">
                <h2 className="text-2xl font-bold">Welcome to Hamza!</h2>
                <div className="text-left mt-4 space-y-4 w-full">
                    <p>
                        We’re thrilled to have you join our community of
                        forward-thinking sellers. Here, you’ll enjoy fast,
                        secure crypto transactions, global reach, and powerful
                        tools to grow your business.
                    </p>
                    <p>
                        The form ahead will take just a few minutes. If you need
                        help, our support team is here for you.
                    </p>
                    <p>Let’s get started on building your store!</p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 bg-[#94D42A] text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-all"
                >
                    Let’s get started!
                </button>
            </div>
        </div>
    );
};

export default WelcomeDialog;
