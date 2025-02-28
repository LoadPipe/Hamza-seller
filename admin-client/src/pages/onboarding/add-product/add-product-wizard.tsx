import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProductInfoStep from './product-info-step';
import ProductAmountStep from './product-amount-step';
import ProductImageStep from './product-image-step';

interface AddProductWizardProps {
  form: any;
  onUpdate: (updates: Partial<any>) => void;
  onNext: () => void;
}

const AddProductWizard: React.FC<AddProductWizardProps> = ({
  form,
  onUpdate,
  onNext,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => setCurrentStep((prev) => prev + 1);
  const goBack = () => setCurrentStep((prev) => prev - 1);
  const finish = () => {
    onNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProductInfoStep
            form={form}
            onUpdate={onUpdate}
            onNext={goNext}
          />
        );
      case 1:
        return (
          <ProductAmountStep
            form={form}
            onUpdate={onUpdate}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 2:
        return (
          <ProductImageStep
            form={form}
            onUpdate={onUpdate}
            onFinish={finish}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-8 py-12">
      <Card className="bg-black border-none">
        {renderStep()}
      </Card>
    </div>
  );
};

export default AddProductWizard;
