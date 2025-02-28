import React, { useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import BusinessInformationStep from './contract-details';
import StoreCustomizationStep from './store-detail';
import { OnboardingValues, onboardingDefaultValues } from './onboarding-schema';
import onboarding_image from '../../../public/images/onboarding_image.png';
import AddProductWizard from './add-product/add-product-wizard';
import AddMemberPrompt from './add-member-prompt';
import AddMemberPage from './add-member-page';
import StoreCompletePage from './store-complete-page';
import { useOnboardingSubmit } from './utils/use-onboarding-submit';
import { useNavigate } from '@tanstack/react-router';

type OnboardingFormInstance = ReturnType<typeof useForm<OnboardingValues>>;

const steps = [
    { label: 'Contract details' },
    { label: 'Store details' },
    { label: 'Add product' },
];

const OnboardingWizard: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<OnboardingValues>(
        onboardingDefaultValues
    );
    const [postWizardStep, setPostWizardStep] = useState<'none' | 'memberPrompt' | 'addMember' | 'complete'>('none');
    const submitMutation = useOnboardingSubmit();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep, postWizardStep]);

    const onboardingForm: OnboardingFormInstance = useForm<OnboardingValues>({
        defaultValues: formData,
    });

    const updateFormData = (newData: Partial<OnboardingValues>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };


    const goNext = () => {
        if (currentStep === steps.length - 1) {
            setPostWizardStep('memberPrompt');
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleSkip = () => {
        onboardingForm.setFieldValue('members', []);
        submitMutation.mutate(onboardingForm.state.values, {
            onSuccess: () => {
                setPostWizardStep('complete');
            },
        });
    };

    const renderWizardStep = () => {
        switch (currentStep) {
            case 0:
                return <BusinessInformationStep form={onboardingForm} onUpdate={updateFormData} onNext={goNext} />;
            case 1:
                return <StoreCustomizationStep form={onboardingForm} onUpdate={updateFormData} onNext={goNext} />;
            case 2:
                return <AddProductWizard form={onboardingForm} onUpdate={updateFormData} onNext={goNext} />;
            default:
                return null;
        }
    };

    const renderPostWizard = () => {
        switch (postWizardStep) {
            case 'memberPrompt':
                return (
                    <AddMemberPrompt
                        onAddMember={() => setPostWizardStep('addMember')}
                        onSkip={handleSkip}
                    />
                );
            case 'addMember':
                return (
                    <AddMemberPage
                        form={onboardingForm}
                        onFinish={() => {
                            submitMutation.mutate(onboardingForm.state.values, {
                                onSuccess: () => {
                                    setPostWizardStep('complete');
                                },
                            });
                        }}
                    />
                );
            case 'complete':
                return <StoreCompletePage onGoToDashboard={() => navigate({ to: '/dashboard' })} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 flex flex-col min-h-screen">
                <div className="flex-grow px-6 pt-8">
                    <div className="mb-12 px-10">
                        <img src="/Hamza-logo.svg" alt="Hamza Logo" className="h-16 w-auto" />
                    </div>
                    {/* Step indicator only for main wizard */}
                    {postWizardStep === 'none' && (
                        <div className="flex items-center gap-20 py-8 justify-center">
                            {steps.map((step, index) => {
                                const isCompleted = currentStep > index;
                                const isActive = currentStep === index;
                                return (
                                    <div key={step.label} className="flex flex-col items-center">
                                        <div className="relative flex items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                                    ? "bg-[#94D42A]"
                                                    : isActive
                                                        ? "bg-[#94D42A]"
                                                        : "bg-gray-600"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <span className="text-black font-bold text-sm">✓</span>
                                                ) : (
                                                    <span className="text-black font-bold text-sm">{index + 1}</span>
                                                )}
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className="absolute top-1/2 left-full w-36 h-[2px] bg-gray-600 -translate-y-1/2" />
                                            )}
                                        </div>
                                        <div className="mt-2 text-sm text-center">{step.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="w-full py-2 px-5 min-h-[300px]">
                        {postWizardStep === 'none' ? renderWizardStep() : renderPostWizard()}
                    </div>

                </div>

                <div className="px-12 pb-4 text-gray-400 text-base mb-8 font-normal">
                    {/* Help & Privacy Policy Links */}
                    <p>
                        By proceeding, you agree to the{" "}
                        <a href="#" className="text-[#94D42A]">
                            Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#94D42A]">
                            Privacy Policy
                        </a>.
                    </p>

                    <div className="flex gap-6 mt-4">
                        <a href="#" className="text-gray-400 hover:text-[#94D42A]">
                            Help
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#94D42A]">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:block m-2">
                <img
                    src={onboarding_image}
                    alt="Onboarding"
                    className="w-full min-h- object-cover rounded-2xl"
                />
            </div>
        </div>
    );
};

export default OnboardingWizard;
