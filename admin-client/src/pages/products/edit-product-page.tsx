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
                        <Input
                            placeholder="Product Name"
                            defaultValue={product?.title || ''}
                            className="mb-4"
                        />
                        <Input
                            placeholder="Subtitle"
                            defaultValue={product?.subtitle || ''}
                            className="mb-4"
                        />
                        <Textarea
                            placeholder="Description"
                            rows={4}
                            defaultValue={product?.description || ''}
                        />
                    </div>

                    {/* Product Media */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">
                            Product Media
                        </h2>
                        <div className="border border-dashed border-gray-500 rounded-lg p-4 text-center">
                            {product?.thumbnail && (
                                <img
                                    src={product.thumbnail}
                                    alt={product.title ?? 'Product Image'}
                                    className="object-cover rounded-md mx-auto"
                                />
                            )}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Pricing</h2>
                        {product?.variants?.map((variant) => (
                            <div key={variant.id} className="mb-4">
                                <h3 className="text-sm font-medium">
                                    {variant.title}
                                </h3>
                                {variant.prices?.map((price) => (
                                    <div key={price.id}>
                                        <Input
                                            placeholder={`Price in ${price.currency_code.toUpperCase()}`}
                                            defaultValue={price.amount}
                                            className="mb-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
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
