'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AddCategoryDialog() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-600">+ Add New Category</Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-1"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <Input id="name" placeholder="Ex. Clothes" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium mb-1"
                                    htmlFor="slug"
                                >
                                    Slug
                                    <span className="ml-1 text-gray-500 text-xs">
                                        (i)
                                    </span>
                                </label>
                                <Input id="slug" placeholder="Enter slug" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Parent Category
                                </label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="None" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        <SelectItem value="electronics">
                                            Electronics
                                        </SelectItem>
                                        <SelectItem value="fashion">
                                            Fashion
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Upload Category Image
                            </label>
                            <div className="border border-dashed border-gray-500 rounded-lg p-4 text-center">
                                <p className="text-sm">
                                    Drag and drop or click to upload
                                </p>
                                <p className="text-xs text-gray-400">
                                    You can upload a photo in PDF, JPG, JPEG,
                                    PNG, GIF, MP4 (less than 5MB).
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => setOpen(false)}
                                className="bg-green-600"
                            >
                                Add New Category
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
