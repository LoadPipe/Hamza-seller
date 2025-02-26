import React from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { OnboardingValues } from '../onboarding-schema';

interface ProductInfoStepProps {
  form: any;
  onUpdate: (updates: Partial<OnboardingValues>) => void;
  onNext: () => void;
}

const ProductInfoStep: React.FC<ProductInfoStepProps> = ({
  form,
  onUpdate,
  onNext,
}) => {
  const { toast } = useToast();

  const handleNext = () => {
    const { productName, productInformation, productDescription } =
      form.state.values;

    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a product name.',
      });
      return;
    }
    if (!productInformation) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter some product information.',
      });
      return;
    }
    if (!productDescription) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a product description.',
      });
      return;
    }

    onUpdate({ productName, productInformation, productDescription });
    onNext();
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
          <div className="grid grid-cols-1 gap-6">
            {/* Product Name */}
            <Field
              form={form}
              name="productName"
              validators={{
                onBlur: ({ value }) =>
                  !value ? 'Product name is required.' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="block mb-2 text-white">Product name</label>
                  <Input
                    placeholder="Ex. Stylish T-Shirt"
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
                  {field.state.meta.errors &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                </div>
              )}
            </Field>

            {/* Product Information */}
            <Field
              form={form}
              name="productInformation"
              validators={{
                onBlur: ({ value }) =>
                  !value ? 'Product information is required.' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="block mb-2 text-white">
                    Product information
                  </label>
                  <Input
                    placeholder="Short details or highlights"
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
                  {field.state.meta.errors &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                </div>
              )}
            </Field>

            {/* Product Description */}
            <Field
              form={form}
              name="productDescription"
              validators={{
                onBlur: ({ value }) =>
                  !value ? 'Product description is required.' : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="block mb-2 text-white">
                    Product description
                  </label>
                  <Textarea
                    placeholder="Give a detailed description of the product..."
                    value={
                      typeof field.state.value === 'string'
                        ? field.state.value
                        : ''
                    }
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="rounded-lg bg-black text-white border border-white
                               placeholder-gray-500 px-4 py-2 focus:ring-2 
                               focus:ring-[#94D42A] w-full"
                    style={{ minHeight: '100px' }}
                  />
                  {field.state.meta.errors &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.join(', ')}
                      </span>
                    )}
                </div>
              )}
            </Field>
          </div>

          {/* Step Indicator (3 dots) */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="w-3 h-3 rounded-full bg-[#94D42A]" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
          </div>

          {/* Next Button */}
          <div className="mt-6">
            <Button
              onClick={handleNext}
              className="w-full h-10 bg-[#94D42A] text-black font-semibold px-6 py-2 rounded-full"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfoStep;
