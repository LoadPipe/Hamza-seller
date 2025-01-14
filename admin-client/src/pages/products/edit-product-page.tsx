import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { fetchProductById } from '@/pages/products/api/product-by-id.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { useForm } from '@tanstack/react-form';
import { updateProductById } from '@/pages/products/api/update-product-by-id.ts';

type Product = z.infer<typeof ProductSchema>;

type FetchProductResponse = {
    product: Product;
    availableCategories: { id: string; name: string }[];
};

export default function EditProductPage() {
    const { id: productId } = useParams({ from: '/products/$id/edit' });
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery<FetchProductResponse, Error>({
        queryKey: ['edit-product', productId],
        queryFn: () => fetchProductById(productId),
    });
    const { product } = data ?? {
        product: undefined,
        availableCategories: [],
    };
    const form = useForm({
        defaultValues: {
            title: product?.title || '',
            subtitle: product?.subtitle || '',
            description: product?.description || '',
            thumbnail: product?.thumbnail || '',
            weight: product?.variants?.[0]?.weight || 0,
            length: product?.variants?.[0]?.length || 0,
            height: product?.variants?.[0]?.height || 0,
            width: product?.variants?.[0]?.width || 0,
        },
        onSubmit: async ({ value }) => {
            console.log('Submitted data:', value);
            try {
                await updateProductById(productId, JSON.stringify(value));
                navigate({ to: '/products' });
            } catch (err) {
                console.error('Failed to update product:', err);
            }
        },
        // validate: (values) => {
        //     const result = ProductSchema.safeParse(values);
        //     return result.success ? {} : result.error.format();
        // },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product data</div>;

    // const { product, availableCategories } = data ?? {

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

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-medium mb-4">
                                General Information
                            </h2>

                            <form.Field name="title">
                                {(field) => (
                                    <>
                                        <Label>Product Name:</Label>
                                        <Input
                                            placeholder="Product Name"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {field.state.meta.errors?.length >
                                            0 && (
                                            <span className="text-red-500">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                            </form.Field>

                            <form.Field name="subtitle">
                                {(field) => (
                                    <>
                                        <Label>Product Information:</Label>
                                        <Input
                                            placeholder="Subtitle"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </form.Field>

                            <form.Field name="description">
                                {(field) => (
                                    <>
                                        <Label>Description:</Label>
                                        <Textarea
                                            placeholder="Description"
                                            rows={10}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </form.Field>
                        </div>

                        <div>
                            <h2 className="text-lg font-medium mb-4">
                                Product Media
                            </h2>
                            <form.Field name="thumbnail">
                                {(field) => (
                                    <>
                                        <Label>Thumbnail URL:</Label>
                                        <Input
                                            placeholder="Thumbnail URL"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {field.state.value && (
                                            <img
                                                src={field.state.value}
                                                alt="Thumbnail Preview"
                                                className="object-cover rounded-md mx-auto max-w-[200px] max-h-[200px] mt-4"
                                            />
                                        )}
                                    </>
                                )}
                            </form.Field>
                        </div>
                    </div>

                    {product?.variants && product.variants.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-medium mb-4">
                                Variants
                            </h2>
                            <Accordion type="single" collapsible>
                                {product.variants.map((variant, index) => (
                                    <AccordionItem
                                        key={variant.id}
                                        value={`variant-${index}`}
                                    >
                                        <AccordionTrigger>
                                            Variant #{index + 1}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-700 py-2">
                                                <div>
                                                    <Label>Title</Label>
                                                    <Input
                                                        placeholder="Variant Title"
                                                        defaultValue={
                                                            variant.title || ''
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>SKU</Label>
                                                    <Input
                                                        placeholder="SKU"
                                                        defaultValue={
                                                            variant.sku || ''
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Price</Label>
                                                    <Input
                                                        placeholder="Price"
                                                        defaultValue={
                                                            typeof variant
                                                                ?.prices?.[0]
                                                                ?.amount ===
                                                            'number'
                                                                ? (
                                                                      variant
                                                                          .prices[0]
                                                                          .amount /
                                                                      100
                                                                  ).toFixed(2)
                                                                : ''
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <Label>Quantity</Label>
                                                    <Input
                                                        placeholder="Quantity"
                                                        defaultValue={
                                                            variant.inventory_quantity ||
                                                            ''
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            {/* Inside the AccordionContent */}
                                            {/* Inside the AccordionContent */}
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {[
                                                    'weight',
                                                    'length',
                                                    'height',
                                                    'width',
                                                ].map((dim) => (
                                                    <div key={dim}>
                                                        <Label>
                                                            {dim
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                dim.slice(1)}
                                                            :
                                                        </Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="number"
                                                                placeholder={
                                                                    dim
                                                                }
                                                                // Prefer ?? so that 0 remains 0
                                                                defaultValue={
                                                                    variant[
                                                                        dim
                                                                    ] ?? 0
                                                                }
                                                            />
                                                            {dim ===
                                                            'weight' ? (
                                                                <Select /* possibly defaultValue="kg" */
                                                                >
                                                                    <SelectTrigger>
                                                                        <Button variant="outline">
                                                                            kg
                                                                        </Button>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="kg">
                                                                            kg
                                                                        </SelectItem>
                                                                        <SelectItem value="lb">
                                                                            lb
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <Select /* possibly defaultValue="cm" */
                                                                >
                                                                    <SelectTrigger>
                                                                        <Button variant="outline">
                                                                            cm
                                                                        </Button>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">
                                                                            cm
                                                                        </SelectItem>
                                                                        <SelectItem value="inch">
                                                                            inch
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    <div className="flex justify-end mt-8">
                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button type="submit" disabled={!canSubmit}>
                                    {isSubmitting
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </Button>
                            )}
                        </form.Subscribe>
                    </div>
                </form>
            </div>
        </div>
    );
}
