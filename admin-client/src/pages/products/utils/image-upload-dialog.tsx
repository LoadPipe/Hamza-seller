import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadProductThumbnail } from '@/pages/products/api/upload-product-thumbnail';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FilePlus, CircleAlert, Loader2 } from 'lucide-react';

interface ImageUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onImageUpload: (imageUrl: string) => void; // Pass uploaded image URL back to form
    storeHandle: string; // Store handle needed for upload API
    productId: string; // Product ID needed for upload API
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
    open,
    onClose,
    onImageUpload,
    storeHandle,
    productId,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const onDrop = (acceptedFiles: File[]) => {
        const imageFile = acceptedFiles[0];
        if (imageFile?.type.startsWith('image/')) {
            setFile(imageFile);
        } else {
            toast({
                title: 'Invalid File Type',
                description: 'Only image files (JPG, PNG, WEBP) are allowed.',
                variant: 'destructive',
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        multiple: false,
    });

    const uploadThumbnailMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadProductThumbnail(file, storeHandle, productId);
        },
        onSuccess: (uploadedImageUrl) => {
            toast({
                title: 'Success',
                description: 'Image uploaded successfully!',
            });
            onImageUpload(uploadedImageUrl); // Pass URL back to parent component
            queryClient.invalidateQueries({
                queryKey: ['view-product-form', productId],
            });
            onClose(); // Close dialog
        },
        onError: (error: any) => {
            toast({
                title: 'Upload Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
            console.error(error);
        },
    });

    const handleUpload = () => {
        if (!file) {
            toast({
                title: 'Error',
                description: 'Please select an image file.',
                variant: 'destructive',
            });
            return;
        }
        uploadThumbnailMutation.mutate(file);
    };

    if (!open) return null;

    return (
        <div className="m-4 fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
            <div className="bg-primary-black-90 rounded-lg p-8 w-[600px]">
                <h2 className="text-xl font-semibold py-4">
                    Upload Product Image
                </h2>

                <div
                    {...getRootProps()}
                    className={`p-6 text-center rounded-lg text-white border-2 border-dashed ${
                        isDragActive
                            ? 'bg-gray-100 border-primary-purple-90'
                            : 'bg-primary-black-90 border-gray-400'
                    }`}
                >
                    <input {...getInputProps()} />
                    {file ? (
                        <p>{file.name}</p>
                    ) : isDragActive ? (
                        <p>Drop the file here...</p>
                    ) : (
                        <div className="text-center">
                            <FilePlus className="mx-auto mb-4" size={28} />
                            <p className="text-white my-4">
                                Drag and drop an image here, or click to select
                                one.
                            </p>
                            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                                <CircleAlert size={16} /> Accepted formats: JPG,
                                PNG, WEBP
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-2">
                    <Button
                        onClick={onClose}
                        className="w-[200px] h-[52px] rounded-[53px] hover:border-none border-primary-purple-90 text-primary-purple-90 hover:bg-red-600"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploadThumbnailMutation.isPending}
                        className="bg-primary-purple-90 rounded-[53px] hover:border-none w-[200px] h-[52px] hover:bg-primary-green-900"
                    >
                        {uploadThumbnailMutation.isPending ? (
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

export default ImageUploadDialog;
