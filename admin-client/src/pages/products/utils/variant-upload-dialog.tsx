// VariantUploadDialog.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { Loader2, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadVariantImageToCDN } from '@/pages/products/api/upload-variant-image';

interface VariantUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onVariantImageUpload: (imageUrl: string, variantIndex: number) => void;
    variantIndex: number;
    storeHandle: string;
    productId: string;
}

const VariantUploadDialog: React.FC<VariantUploadDialogProps> = ({
    open,
    onClose,
    onVariantImageUpload,
    variantIndex,
    storeHandle,
    productId,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const variantUploadMutation = useMutation({
        mutationFn: async (file: File) => {
            // Upload file to CDN and then update DB with the image URL.
            const cdnUrl = await uploadVariantImageToCDN(
                file,
                storeHandle,
                productId,
                variantIndex
            );
            return cdnUrl;
        },
        onSuccess: (cdnUrl) => {
            toast({
                title: 'Success',
                description: 'Variant image uploaded!',
            });
            onVariantImageUpload(cdnUrl, variantIndex);
            onClose();
        },
        onError: (error: any) => {
            toast({
                title: 'Upload Failed',
                description:
                    error.message || 'An error occurred while uploading.',
                variant: 'destructive',
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast({
                title: 'Error',
                description: 'Please select a file to upload.',
                variant: 'destructive',
            });
            return;
        }
        variantUploadMutation.mutate(selectedFile);
    };

    if (!open) return null;

    return (
        <div className="m-4 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-primary-black-90 rounded-lg p-8 w-[400px]">
                <h2 className="text-xl font-semibold py-4">
                    Upload Variant Image
                </h2>
                <div className="border-2 border-dashed border-gray-400 rounded p-4 text-center">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="variant-upload-input"
                    />
                    {!selectedFile ? (
                        <label
                            htmlFor="variant-upload-input"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <FilePlus size={28} className="mb-2" />
                            <span>Click to select an image</span>
                        </label>
                    ) : (
                        <p>{selectedFile.name}</p>
                    )}
                </div>
                <div className="mt-8 flex justify-end gap-2">
                    <Button onClick={onClose} className="w-[120px]">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={
                            !selectedFile || variantUploadMutation.isPending
                        }
                        className="w-[120px]"
                    >
                        {variantUploadMutation.isPending ? (
                            <Loader2 className="animate-spin mx-auto" />
                        ) : (
                            'Upload'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VariantUploadDialog;
