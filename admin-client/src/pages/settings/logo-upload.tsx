import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { uploadLogoImage } from './api/upload-logo-image';

interface LogoUploadProps {
    storeHandle: string;
    onLogoUpload: (logoUrl: string) => void;
    existingLogoUrl?: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
    storeHandle,
    onLogoUpload,
    existingLogoUrl,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingLogoUrl || null);
    const { toast } = useToast();

    useEffect(() => {
        setPreviewUrl(existingLogoUrl || null);
    }, [existingLogoUrl]);

    const onDrop = (acceptedFiles: File[]) => {
        const imageFile = acceptedFiles[0];
        if (imageFile?.type.startsWith('image/')) {
            setFile(imageFile);
        } else {
            toast({
                title: 'Invalid File Type',
                description: 'Only image files (JPG, PNG, SVG) are allowed.',
                variant: 'destructive',
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.svg'] },
        multiple: false,
    });

    const uploadLogoMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadLogoImage(file, storeHandle);
        },
        onSuccess: (uploadedLogoUrl) => {
            onLogoUpload(uploadedLogoUrl);
            setPreviewUrl(uploadedLogoUrl);
            setFile(null);
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
        if (!file) {
            toast({
                title: 'Error',
                description: 'Please select an image file before uploading.',
                variant: 'destructive',
            });
            return;
        }
        uploadLogoMutation.mutate(file);
    };

    return (
        <div>
            <label className="font-sora font-normal text-[16px] text-white">
                Upload Logo
            </label>

            <div
                {...getRootProps()}
                className="border border-gray-500 rounded-[12px] p-[24px] text-center mt-[20px] cursor-pointer"
                style={{ height: '184px' }}
            >
                <input {...getInputProps()} />

                {previewUrl ? (
                    <img src={previewUrl} alt="Logo preview" className="max-h-full mx-auto" />
                ) : isDragActive ? (
                    <p>Drop the file here...</p>
                ) : (
                    <>
                        <p className="text-sm text-[#94D42A] font-semibold">
                            Drag and drop or click to upload
                        </p>
                        <p className="text-xs text-gray-400">
                            Recommended size: 350 x 350. File types: JPG, PNG, SVG.
                        </p>
                    </>
                )}
            </div>

            {file && (
                <div className="mt-4 flex justify-end">
                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploadLogoMutation.isPending}
                        className="bg-[#94D42A] text-black font-semibold rounded-[37px] px-6 py-2"
                    >
                        {uploadLogoMutation.isPending ? (
                            <Loader2 className="animate-spin mx-auto" />
                        ) : (
                            'Upload'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LogoUpload;
