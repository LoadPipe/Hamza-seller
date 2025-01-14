import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { fetchProductById } from '@/pages/products/api/product-by-id.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { z } from 'zod';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { Label } from '@/components/ui/label.tsx';

// This is your "Product" shape, but note you now also have "availableCategories"
type Product = z.infer<typeof ProductSchema>;

// Create an interface describing the shape returned by `fetchProductById`.
interface FetchProductResponse {
    product: Product;
    availableCategories: { id: string; name: string }[];
}

export default function EditProductPage() {
    // Grab the "id" param from "/products/$id/edit"
    const { id: productId } = useParams({ from: '/products/$id/edit' });
    const navigate = useNavigate();

    // Fetch product data & available categories
    // Adjust the `useQuery` types to match your actual return shape
    const { data, isLoading, error } = useQuery<FetchProductResponse, Error>({
        queryKey: ['product-details', productId],
        queryFn: () => fetchProductById(productId),
    });

    console.log(data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product data</div>;

    // Now extract both the product and the availableCategories
    const { product, availableCategories } = data ?? {
        product: [],
        availableCategories: [],
    };

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
            <Button
                variant="ghost"
                onClick={() => navigate({ to: '/products' })}
            >
                Back to All Products
            </Button>

            <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-md mt-4">
                <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* General Information */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">
                            General Information
                        </h2>

                        <Label>Product Name:</Label>
                        <Input
                            placeholder="Product Name"
                            defaultValue={product?.title || ''}
                            className="mb-4"
                        />

                        <Label>Product Information:</Label>
                        <Input
                            placeholder="Subtitle"
                            defaultValue={product?.subtitle || ''}
                            className="mb-4"
                        />

                        <Label>Description:</Label>
                        <Textarea
                            placeholder="Description"
                            rows={10}
                            defaultValue={product?.description || ''}
                            className="resize-none overflow-auto min-h-[4rem] max-h-[15rem]"
                        />
                    </div>

                    {/* Product Media */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">
                            Product Media
                        </h2>

                        <Label className="">Images</Label>
                        <div className="my-4 border border-dashed border-gray-500 rounded-lg p-4 text-center">
                            {product?.thumbnail && (
                                <img
                                    src={product.thumbnail}
                                    alt={product.title ?? 'Product Image'}
                                    className="object-cover rounded-md mx-auto max-w-[200px] max-h-[200px]" // Tailwind CSS for limiting size
                                />
                            )}
                        </div>
                        <Button>Update Thumbnail Image</Button>
                    </div>

                    {/* Pricing */}

                    {/* Pricing Section */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Pricing</h2>

                        {product?.variants && product.variants.length > 0 ? (
                            <>
                                {/* Log variants for debugging */}
                                {console.log('Variants:', product.variants)}

                                {/* Base Price - First Variant */}
                                <div className="mb-6">
                                    <Label>Base Price:</Label>
                                    <Input
                                        placeholder="Base Price"
                                        defaultValue={
                                            product.variants[0]?.prices?.[0]
                                                ?.amount || ''
                                        }
                                        className="mb-4"
                                    />
                                </div>

                                {/* Discount and SKU Section */}
                                {/*<div className="grid grid-cols-2 gap-4">*/}
                                {/*    <div>*/}
                                {/*        <Label>Discount Percentage (%):</Label>*/}
                                {/*        <Input*/}
                                {/*            placeholder="Enter Discount"*/}
                                {/*            defaultValue={*/}
                                {/*                product?.discount_percentage ||*/}
                                {/*                ''*/}
                                {/*            }*/}
                                {/*            className="mb-4"*/}
                                {/*        />*/}
                                {/*    </div>*/}
                                {/*    <div>*/}
                                {/*        <Label>Discount Type:</Label>*/}
                                {/*        <Select>*/}
                                {/*            <SelectTrigger className="w-full">*/}
                                {/*                <Button variant="outline">*/}
                                {/*                    Percentage Discount*/}
                                {/*                </Button>*/}
                                {/*            </SelectTrigger>*/}
                                {/*            <SelectContent>*/}
                                {/*                <SelectItem value="percentage">*/}
                                {/*                    Percentage Discount*/}
                                {/*                </SelectItem>*/}
                                {/*                <SelectItem value="fixed">*/}
                                {/*                    Fixed Amount*/}
                                {/*                </SelectItem>*/}
                                {/*            </SelectContent>*/}
                                {/*        </Select>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/* Additional Variant Details */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label>SKU:</Label>
                                        <Input
                                            placeholder="Enter SKU"
                                            defaultValue={
                                                product.variants[0]?.sku || ''
                                            }
                                            className="mb-4"
                                        />
                                    </div>
                                    <div>
                                        <Label>Barcode:</Label>
                                        <Input
                                            placeholder="Enter Barcode"
                                            defaultValue={
                                                product.variants[0]?.barcode ||
                                                ''
                                            }
                                            className="mb-4"
                                        />
                                    </div>
                                    <div>
                                        <Label>Quantity:</Label>
                                        <Input
                                            placeholder="Enter Quantity"
                                            defaultValue={
                                                product.variants[0]
                                                    ?.inventory_quantity || ''
                                            }
                                            className="mb-4"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>No variants found for this product.</div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Category</h2>
                        <Select>
                            <SelectTrigger className="w-full">
                                <Button variant="outline">
                                    {/*
                    Show the first assigned category name for the product
                    OR a fallback "Select Category"
                  */}
                                    {product?.categories?.[0]?.name ||
                                        'Select Category'}
                                </Button>
                            </SelectTrigger>
                            <SelectContent>
                                {/*
                  Populate the dropdown from `availableCategories`
                  (i.e. all categories in the system)
                */}
                                {availableCategories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="my-2">
                            Add Product to Category
                        </Button>
                    </div>
                </div>

                {/* Variants Section */}
                <div>
                    <h2 className="text-lg font-medium mb-4">Product Data</h2>

                    <div className="flex gap-4 mb-4">
                        <Button variant="outline" className="w-full">
                            Attributes
                        </Button>
                        <Button
                            variant="solid"
                            className="w-full bg-green-500 text-white"
                        >
                            Variants
                        </Button>
                    </div>

                    {/* Variants Panel */}
                    {product?.variants && product.variants.length > 0 ? (
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                                <Button variant="outline" size="sm">
                                    Add Manually
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-500"
                                >
                                    Generate Variants
                                </Button>
                            </div>

                            {/* Default Form Values */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <Label>Default Form Value (Size):</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <Button variant="outline">
                                                Small
                                            </Button>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="small">
                                                Small
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="large">
                                                Large
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Default Form Value (Color):</Label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <Button variant="outline">
                                                Red
                                            </Button>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="red">
                                                Red
                                            </SelectItem>
                                            <SelectItem value="blue">
                                                Blue
                                            </SelectItem>
                                            <SelectItem value="yellow">
                                                Yellow
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Render Variants */}
                            {product.variants.map((variant, index) => (
                                <div
                                    key={variant.id}
                                    className="grid grid-cols-5 gap-4 items-center border-b border-gray-700 py-2"
                                >
                                    <div>
                                        <span className="text-sm font-medium">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <Button variant="outline">
                                                    {variant?.title ||
                                                        'Select Size'}
                                                </Button>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="small">
                                                    Small
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value="large">
                                                    Large
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <Button variant="outline">
                                                    {variant?.color ||
                                                        'Select Color'}
                                                </Button>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="red">
                                                    Red
                                                </SelectItem>
                                                <SelectItem value="blue">
                                                    Blue
                                                </SelectItem>
                                                <SelectItem value="yellow">
                                                    Yellow
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input
                                            placeholder="Price"
                                            defaultValue={
                                                variant?.prices?.[0]?.amount
                                                    ? (
                                                          variant.prices[0]
                                                              .amount / 100
                                                      ).toFixed(2)
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Quantity"
                                            defaultValue={
                                                variant?.inventory_quantity ||
                                                ''
                                            }
                                            className="w-full"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500"
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">
                            No variants found for this product.
                        </div>
                    )}
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
