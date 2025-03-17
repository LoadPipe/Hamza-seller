import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { importProductsByCsv } from '@/pages/products/api/import-products-by-csv';
import { FilePlus, CircleAlert } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import DOMPurify from 'dompurify';

interface ProductImportDialogProps {
    open: boolean;
    onClose: () => void;
}

const ProductImportDialog: React.FC<ProductImportDialogProps> = ({
    open,
    onClose,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const onDrop = (acceptedFiles: File[]) => {
        const csvFile = acceptedFiles[0];
        if (csvFile?.type === 'text/csv') {
            setFile(csvFile);
        } else {
            toast({
                title: 'Invalid File Type',
                description: 'Only CSV files are allowed.',
                variant: 'destructive',
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
    });

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: 'Error',
                description: 'Please select a CSV file.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await importProductsByCsv(file);
            const sanitizeSuccessMessage = DOMPurify.sanitize(response.message);
            toast({
                title: 'Success',
                description: (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: sanitizeSuccessMessage,
                        }}
                    />
                ),
            });
            // console.log(response);

            // Invalidate products query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['products'] });

            // onClose(); // Close dialog on success
        } catch (error: any) {
            // Display the error message from the caught exception
            const errorResponse = error?.response?.data;
            const rawErrorMessage =
                error.message ||
                errorResponse?.message ||
                'An unexpected error occurred.';
            const sanitizeErrorMessage = DOMPurify.sanitize(rawErrorMessage);

            toast({
                title: 'Upload Failed',
                description: (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: sanitizeErrorMessage,
                        }}
                    />
                ),
                variant: 'destructive',
            });
        }
    };

    if (!open) return null;

    return (
        <div className="m-4 fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 ">
            <div className="bg-primary-black-90 rounded-lg p-8 w-[600px] ">
                <h2 className="text-xl font-semibold py-4">Upload CSV</h2>

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
                                Drag and drop your CSV file here, or click to
                                select a file.
                            </p>
                            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                                <CircleAlert size={16} /> Max file size: 100MB
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
                        disabled={!file}
                        className="bg-primary-purple-90 rounded-[53px] hover:border-none w-[200px] h-[52px] hover:bg-primary-green-900"
                    >
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductImportDialog;
