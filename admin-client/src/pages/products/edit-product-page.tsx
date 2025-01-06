import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';

export default function EditProductPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <button
                className="mb-4"
                onClick={() =>
                    navigate({
                        to: '/products',
                    })
                }
            >
                Back to All Products
            </button>
            <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* General Information */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">
                            General Information
                        </h2>
                        <Input
                            placeholder="Product Name"
                            defaultValue="Macbook Pro 14 M3 Chip 8GB Unified Memory 512GB SSD Storage"
                            className="mb-4"
                        />
                        <Input
                            placeholder="Product Information"
                            defaultValue="Apple M3 chip with 8-core CPU, 10-core GPU, 16-core Neural Engine \u2022 8GB unified memory \u2022 512GB SSD storage..."
                            className="mb-4"
                        />
                        <Textarea
                            placeholder="Description"
                            rows={4}
                            defaultValue={
                                'SUPERCHARGED BY M3 — With an 8-core CPU and 10-core GPU, the Apple M3 chip can help you blaze through everyday multitasking and take on pro projects like editing thousands of photos or 4K video. \u2022 UP TO 22 HOURS OF BATTERY LIFE — Go all day thanks to the power...'
                            }
                        />
                    </div>

                    {/* Product Media */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">
                            Product Media
                        </h2>
                        <div className="border border-dashed border-gray-500 rounded-lg p-4 text-center">
                            <p className="text-sm">
                                Drag and drop or click to upload
                            </p>
                            <p className="text-xs text-gray-400">
                                You can upload multiple media in PDF, JPG, JPEG,
                                PNG, GIF, MP4 (less than 5MB).
                            </p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Pricing</h2>
                        <Input
                            placeholder="Base Price"
                            defaultValue="1499.99"
                            className="mb-4"
                        />
                        <div className="flex gap-4">
                            <Input
                                placeholder="Discount Percentage (%)"
                                defaultValue="10%"
                                className="flex-1"
                            />
                            <Select>
                                <SelectTrigger className="w-full">
                                    <Button variant="outline">
                                        Percentage Discount
                                    </Button>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">
                                        Percentage Discount
                                    </SelectItem>
                                    <SelectItem value="fixed">
                                        Fixed Discount
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <Input
                                placeholder="SKU"
                                defaultValue="UY3897"
                                className="flex-1"
                            />
                            <Input
                                placeholder="Barcode"
                                defaultValue="189674421"
                                className="flex-1"
                            />
                        </div>
                        <Input
                            placeholder="Quantity"
                            defaultValue="32"
                            className="mt-4"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Category</h2>
                        <Select>
                            <SelectTrigger className="w-full">
                                <Button variant="outline">Electronics</Button>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electronics">
                                    Electronics
                                </SelectItem>
                                <SelectItem value="fashion">Fashion</SelectItem>
                                <SelectItem value="home">Home</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Product Tags"
                            defaultValue="Laptops"
                            className="mt-4"
                        />
                    </div>
                </div>

                {/* Product Data */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium mb-4">Product Data</h2>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="flex-1">
                            Attributes
                        </Button>
                        <Button variant="ghost" className="flex-1">
                            Variants
                        </Button>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-4 mt-4">
                        <h3 className="text-sm font-medium mb-2">
                            New Attribute
                        </h3>
                        <Input
                            placeholder="Attribute Name (e.g., Color, Size)"
                            className="mb-4"
                        />
                        <Textarea
                            placeholder="Enter options (e.g., Red, Small). Use commas or vertical bars to separate options."
                            rows={3}
                        />
                        <div className="mt-4">
                            <Button className="mr-4">Save Attribute</Button>
                            <Button variant="ghost">Cancel</Button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    <Button variant="ghost" className="text-red-500">
                        Discard Changes
                    </Button>
                    <Button>Update Product</Button>
                </div>
            </div>
        </div>
    );
}
