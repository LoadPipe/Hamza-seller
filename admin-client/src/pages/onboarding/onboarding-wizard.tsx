import React, { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import BusinessInformationStep from './business-Information';
import StoreCustomizationStep from './store-customization';
import PaymentPreferencesStep from './payment-preferences';
import { OnboardingValues, onboardingDefaultValues } from './onboarding-schema';
import WelcomeDialog from './welcome-dialog';

type OnboardingFormInstance = ReturnType<typeof useForm<OnboardingValues>>;

const steps = [
    { label: 'Business Information' },
    { label: 'Store Customization' },
    { label: 'Payment Preferences' },
];

const OnboardingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showWelcome, setShowWelcome] = useState(true);
    const [formData, setFormData] = useState<OnboardingValues>(
        onboardingDefaultValues
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const onboardingForm: OnboardingFormInstance = useForm<OnboardingValues>({
        defaultValues: formData,
    });

    const updateFormData = (newData: Partial<OnboardingValues>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleCloseWelcome = () => {
        setShowWelcome(false);
    };

    const goNext = () =>
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <BusinessInformationStep
                        form={onboardingForm}
                        onUpdate={updateFormData}
                        onNext={goNext}
                    />
                );
            case 1:
                return (
                    <StoreCustomizationStep
                        form={onboardingForm}
                        onUpdate={updateFormData}
                        onNext={goNext}
                        onBack={goBack}
                    />
                );
            case 2:
                return (
                    <PaymentPreferencesStep
                        form={onboardingForm}
                        onUpdate={updateFormData}
                        onBack={goBack}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <WelcomeDialog isOpen={showWelcome} onClose={handleCloseWelcome} />
            <div className="flex justify-center items-center gap-8 py-6">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isActive = currentStep === index;

                    return (
                        <div
                            key={step.label}
                            className="flex flex-col items-center"
                        >
                            <div className="relative flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center
                                    ${
                                        isCompleted
                                            ? 'bg-[#94D42A]'
                                            : isActive
                                              ? 'bg-[#94D42A]'
                                              : 'bg-gray-600'
                                    }
                                    `}
                                >
                                    {isCompleted ? (
                                        <span className="text-black font-bold text-sm">
                                            ✓
                                        </span>
                                    ) : (
                                        <span className="text-black font-bold text-sm">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="absolute top-1/2 left-full w-28 h-[2px] bg-gray-600 -translate-y-1/2 ml-2" />
                                )}
                            </div>

                            <div className="mt-2 text-sm text-center">
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Render Current Step */}
            <div className="max-w-5xl mx-auto px-4">{renderStep()}</div>
        </div>
    );
};

export default OnboardingWizard;
