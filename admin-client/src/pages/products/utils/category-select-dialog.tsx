'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProductSchema } from '../product-schema';
import { z } from 'zod';

export type Category = NonNullable<z.infer<typeof ProductSchema>['categories']>[number];

interface CategorySelectDialogProps {
    open: boolean;
    onClose: () => void;
    categories: Category[];
    onSelect: (category: Category) => void;
}

export default function CategorySelectDialog({
    open,
    onClose,
    categories,
    onSelect,
}: CategorySelectDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Reset the input field whenever the dialog opens
    useEffect(() => {
        if (open) {
            setSearchTerm('');
        }
    }, [open]);

    const filteredCategories = useMemo(() => {
        return categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    if (!open) return null;

    // const handleAddNew = () => {
    //     const newCategory: Category = {
    //         id: `${searchTerm.toLowerCase().replace(/\s+/g, '-')}`,
    //         name: searchTerm,
    //         handle: searchTerm.toLowerCase().replace(/\s+/g, '-'),
    //         parent_category_id: null,
    //         is_active: true,
    //         rank: 0,
    //         description: null,
    //         created_at: new Date().toISOString(),
    //         updated_at: new Date().toISOString(),
    //         is_internal: false,
    //         metadata: {},
    //     };
    //     onSelect(newCategory);
    //     onClose();
    // };


    return (
        <div className="m-4 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-primary-black-90 rounded-lg p-8 w-[600px]">
                <h2 className="text-xl font-semibold pb-4 text-white">Select Category</h2>
                <div className="space-y-4">
                    <Label htmlFor="category-search" className="block text-white">
                        Search Category
                    </Label>
                    <Input
                        id="category-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Type category name..."
                        className="w-full"
                    />
                    {/* Scrollable list */}
                    <div className="mt-4 max-h-60 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant="ghost"
                                    onClick={() => {
                                        onSelect(category);
                                        onClose();
                                    }}
                                    style={{ borderRadius: 'unset' }}
                                    className="w-full justify-start"
                                >
                                    {category.name}
                                </Button>
                            ))
                        ) : (
                            <div className="text-white">No categories found.</div>
                            // <Button
                            //     onClick={handleAddNew}
                            //     variant="outline"
                            //     style={{ borderRadius: '8px' }}
                            //     className="w-full justify-start bg-white text-black hover:bg-gray-100"
                            // >
                            //     Add New Category "{searchTerm}"
                            // </Button>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose} className="w-[120px]">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
