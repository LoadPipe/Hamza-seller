// GalleryUploadDialog.tsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { uploadGalleryImages } from '@/pages/products/api/upload-gallery-images';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FilePlus, Trash, Loader2 } from 'lucide-react';

interface GalleryImage {
    id: string;
    url: string;
    fileName: string; // e.g. 'gallery_1.png'
}

interface GalleryUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onGalleryUpload: (imageUrls: string[]) => void;
    storeHandle: string;
    productId: string;
    currentGallery: GalleryImage[]; // Array of objects with id, url, fileName
    onDeleteImage: (image: GalleryImage) => void;
}

const GalleryUploadDialog: React.FC<GalleryUploadDialogProps> = ({
    open,
    onClose,
    onGalleryUpload,
    storeHandle,
    productId,
    currentGallery,
    onDeleteImage,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const onDrop = (acceptedFiles: File[]) => {
        const totalAfterDrop = currentGallery.length + acceptedFiles.length;
        if (totalAfterDrop > 5) {
            toast({
                title: 'Limit Exceeded',
                description: 'New images will replace the oldest ones.',
                variant: 'destructive',
            });
        }
        setFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        multiple: true,
    });

    // Mutation for uploading gallery images.
    const uploadGalleryMutation = useMutation({
        mutationFn: async ({
            files,
            replacementFileName,
        }: {
            files: File[];
            replacementFileName?: string;
        }) => {
            return await uploadGalleryImages(files, storeHandle, productId, {
                replacementFileName,
            });
        },
        onSuccess: (uploadedImageUrls) => {
            toast({
                title: 'Success',
                description: 'Gallery images uploaded!',
            });
            onGalleryUpload(uploadedImageUrls);
            queryClient.invalidateQueries({
                queryKey: ['view-product-form', productId],
            });
            setFiles([]);
            onClose();
        },
        onError: (error: any) => {
            toast({
                title: 'Upload Failed',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        },
    });

    const handleUpload = () => {
        if (files.length === 0) {
            toast({
                title: 'Error',
                description: 'Please select at least one image file.',
                variant: 'destructive',
            });
            return;
        }

        let replacementFileName: string | undefined = undefined;
        // Check if adding these files would exceed 5.
        const totalAfterDrop = currentGallery.length + files.length;
        if (totalAfterDrop > 5) {
            const removeCount = totalAfterDrop - 5;
            // Assume the oldest images are at the beginning of currentGallery.
            const imagesToRemove = currentGallery.slice(0, removeCount);
            if (imagesToRemove.length > 0) {
                // Use the fileName of the oldest image as the replacement name for the first new file.
                replacementFileName = imagesToRemove[0].fileName;
                // Trigger deletion for these images.
                imagesToRemove.forEach((img) => {
                    onDeleteImage(img);
                });
            }
        }

        uploadGalleryMutation.mutate({ files, replacementFileName });
    };

    if (!open) return null;

    return (
        <div className="m-4 fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
            <div className="bg-primary-black-90 rounded-lg p-8 w-[600px]">
                <h2 className="text-xl font-semibold py-4">
                    Upload Gallery Images
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
                    {files.length > 0 ? (
                        <p>{files.length} files selected</p>
                    ) : isDragActive ? (
                        <p>Drop the files here...</p>
                    ) : (
                        <div className="text-center">
                            <FilePlus className="mx-auto mb-4" size={28} />
                            <p className="text-white my-4">
                                Drag and drop images here, or click to select.
                            </p>
                        </div>
                    )}
                </div>
                {/* Display existing gallery images with delete buttons */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                    {currentGallery.map((image) => (
                        <div key={image.id} className="relative group">
                            <img
                                src={image.url}
                                className="rounded w-full h-24 object-cover"
                                alt="Gallery"
                            />
                            <button
                                onClick={() => onDeleteImage(image)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end gap-2">
                    <Button onClick={onClose} className="w-[200px]">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={uploadGalleryMutation.isPending}
                        className="w-[200px]"
                    >
                        {uploadGalleryMutation.isPending ? (
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

export default GalleryUploadDialog;
