import React, { useRef, useState } from 'react';
import { Field } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TrashIcon } from 'lucide-react';
import { OnboardingValues } from '../onboarding-schema';
import { uploadGalleryImages } from '@/pages/products/api/upload-gallery-images';
import { useMutation } from '@tanstack/react-query';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const storeSlug = 'temp-store'; 
  const productId = 'temp-product';


  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const urls = await uploadGalleryImages(files, storeSlug, productId);
      if (!urls || urls.length === 0) {
        throw new Error('Upload failed: no image URLs returned.');
      }
      console.log("Uploaded URLs:", urls);
      return urls;
    },
    onSuccess: (urls: string[]) => {
      toast({
        title: 'Success',
        description: 'Product images uploaded successfully!',
      });
      form.setFieldValue('productMedia', urls);
      onUpdate({ productMedia: urls });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload Failed',
        description: error.message || 'An unexpected error occurred during upload.',
        variant: 'destructive',
      });
      setFiles([]);
    },
  });

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
    onFinish();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(fileArray);
      form.setFieldValue('productMedia', fileArray);
      toast({
        variant: 'default',
        title: 'Files Selected',
        description: `${fileArray.length} file(s) selected.`,
      });
      uploadMutation.mutate(fileArray);
    }
  };

  // Modified delete handler to update form state directly
  const handleDeleteFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    form.setFieldValue('productMedia', updatedFiles);
    toast({
      variant: 'default',
      title: 'File Removed',
      description: `File removed successfully.`,
    });
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
            {/* Product Media Upload */}
            <div>
              <label className="block mb-2 text-white font-medium">Media</label>
              <div
                onClick={handleUploadClick}
                className="border border-dashed border-gray-500 rounded-lg p-4 text-center min-h-[200px] flex flex-col items-center justify-center cursor-pointer"
              >
                <p className="text-sm">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-400">
                  You can upload multiple media in PDF, JPG, JPEG, PNG, GIF,
                  MP4 less than 5MB.
                </p>
              </div>
              {/* Hidden File Input */}
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Display uploaded file names with delete icon */}
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white mb-2">Uploaded Files:</h3>
                <ul className="text-white text-sm space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleDeleteFile(index)}
                        className="p-1 hover:text-red-500"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
                    className="rounded-lg bg-black text-white border border-white placeholder-gray-500 px-4 py-2 h-[42px] focus:ring-2 focus:ring-[#94D42A] w-full"
                  />
                </div>
              )}
            </Field>
          </div>

          {/* Step Indicator */}
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
