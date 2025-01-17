import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { importProductsByCsv } from '@/pages/products/api/import-products-by-csv';

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
            toast({
                title: 'Success',
                description: 'Products imported successfully!',
            });
            console.log(response);
            onClose(); // Close dialog on success
        } catch (error) {
            toast({
                title: 'Upload Failed',
                description: 'Unable to import products. Please try again.',
                variant: 'destructive',
            });
            console.error(error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-black-90 bg-opacity-80">
            <div className="bg-primary-black-90 rounded-lg p-8 w-96 ">
                <h2 className="text-lg font-semibold">Import Products</h2>
                <p className="text-white mb-4">
                    Drag and drop your CSV file here, or click to select a file.
                </p>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-6 text-center rounded-md text-black ${
                        isDragActive ? 'bg-gray-100' : 'bg-white'
                    }`}
                >
                    <input {...getInputProps()} />
                    {file ? (
                        <p>{file.name}</p>
                    ) : isDragActive ? (
                        <p>Drop the file here...</p>
                    ) : (
                        <p>Drag and drop a file here, or click to upload.</p>
                    )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
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
