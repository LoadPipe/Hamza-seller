import React from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from '../onboarding-schema';

interface ProductImageStepProps {
  form: any;
  onUpdate: (updates: Partial<OnboardingValues>) => void;
  onFinish: () => void; 
  onBack: () => void;
}

const ProductImageStep: React.FC<ProductImageStepProps> = ({
  form,
  onUpdate,
  onFinish,
}) => {
  const { toast } = useToast();

  const handleProceed = () => {
    const { productCategory } = form.state.values;

    if (!productCategory) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a category.',
      });
      return;
    }

    onUpdate({ productCategory });

    onFinish();
  };

  return (
    <div>
      <Card className="bg-black border-none">
        <CardHeader>
          <CardTitle className="mb-2 font-inter font-semibold text-[32px] leading-none tracking-normal">
            Add first product
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Start selling on Hamza by adding your first product. Upload images,
            set prices, and provide details to attract customers.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Product Media (Placeholder) */}
            <div>
              <label className="block mb-2 text-white font-medium">Media</label>
              <div className="border border-dashed border-gray-500 rounded-lg p-4 text-center min-h-[200px] flex flex-col items-center justify-center">
                <p className="text-sm">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-400">
                  You can upload multiple media in PDF, JPG, JPEG, PNG, GIF,
                  MP4 less than 5MB.
                </p>
              </div>
            </div>

            {/* Category */}
            <Field form={form} name="productCategory">
              {(field) => (
                <div>
                  <label className="block mb-2 text-white">Category</label>
                  <Input
                    placeholder="Ex. Clothing, Electronics, etc."
                    value={
                      typeof field.state.value === 'string'
                        ? field.state.value
                        : ''
                    }
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="rounded-lg bg-black text-white border border-white
                               placeholder-gray-500 px-4 py-2 h-[42px]
                               focus:ring-2 focus:ring-[#94D42A] w-full"
                  />
                </div>
              )}
            </Field>
          </div>

          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-[#94D42A]" />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <Button
              onClick={handleProceed}
              className="w-full h-10 bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
            >
              Proceed
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImageStep;
