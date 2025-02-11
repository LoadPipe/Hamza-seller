import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { fetchProductById } from '@/pages/products/api/product-by-id.ts';
import { updateProductById } from '@/pages/products/api/update-product-by-id.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { getJwtStoreId } from '@/utils/authentication';

import { formatCryptoPrice } from '@/utils/get-product-price.ts';
import { z } from 'zod';
import {
    ProductSchema,
    // validateInput,
} from '@/pages/products/product-schema.ts';
import { Label } from '@/components/ui/label.tsx';
import { useForm, getBy, setBy } from '@tanstack/react-form';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth.ts';
import { useToast } from '@/hooks/use-toast.ts';
import { PackageSearch, Bitcoin } from 'lucide-react';
import { uploadProductThumbnail } from '@/pages/products/api/upload-product-thumbnail.ts';
import ImageUploadDialog from '@/pages/products/utils/image-upload-dialog.tsx';
import { useState } from 'react';

type Product = z.infer<typeof ProductSchema>;

type FetchProductResponse = {
    product: Product;
    availableCategories: { id: string; name: string }[];
};

export default function EditProductPage() {
    const queryClient = useQueryClient();
    const { id: productId } = useParams({ from: '/products/$id/edit' });
    const navigate = useNavigate();
    const preferredCurrency = useCustomerAuthStore(
        (state) => state.preferred_currency_code ?? 'eth'
    );

    const { toast } = useToast();

    const { data, isLoading, error } = useQuery<FetchProductResponse, Error>({
        queryKey: ['view-product-form', productId],
        queryFn: () => fetchProductById(productId),
    });

    const [isImageDialogOpen, setImageDialogOpen] = useState(false);

    const handleImageUpload = (imageUrl: string) => {
        editProductForm.setFieldValue('thumbnail', imageUrl); // Update form
    };

    const cachedStore = queryClient.getQueryData<{ handle: string }>([
        'store',
        getJwtStoreId(),
    ]);

    const storeHandle = cachedStore?.handle ?? '';

    // Mutation to upload a new thumbnail
    const uploadThumbnailMutation = useMutation({
        mutationFn: async (file: File) => {
            return await uploadProductThumbnail(file, storeHandle, productId);
        },
        onSuccess: (uploadedImageUrl) => {
            console.log('Thumbnail uploaded successfully:', uploadedImageUrl);

            editProductForm.setFieldValue('thumbnail', uploadedImageUrl);

            toast({
                variant: 'default',
                title: 'Thumbnail Uploaded!',
                description: 'Your product thumbnail has been updated.',
            });
        },
        onError: (error) => {
            console.error('Thumbnail Upload Failed:', error);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: 'Could not upload image. Please try again.',
            });
        },
    });

    const updateEditForm = useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                console.log('Empty payload; skipping mutation.');
                throw new Error('No changes detected to update.');
            }
            console.log(`PAYLOAD: ${JSON.stringify(payload)}`);
            // console.log(`THIS IS THE PAYLOAD ${JSON.stringify(payload)}`);
            return updateProductById(productId, payload);
        },
        onSuccess: () => {
            // Invalidate or refetch to keep cache in sync
            queryClient.invalidateQueries({ queryKey: ['view-product-form'] });
            // Optionally navigate away
            toast({
                variant: 'default',
                title: 'Success!',
                description: 'Submitted product changes successfully.',
            });
            // navigate({ to: '/products' });
        },
        onError: (err: unknown) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update product.',
            });
            console.error('Failed to update product:', err);
        },
    });

    // 3. Prepare default form values
    const product = data?.product;
    const editProductForm = useForm({
        defaultValues: {
            title: product?.title || '',
            subtitle: product?.subtitle || '',
            description: product?.description || '',
            thumbnail: product?.thumbnail || '',
            weight: product?.weight || 0,
            length: product?.length || 0,
            height: product?.height || 0,
            width: product?.width || 0,
            basePrice: (() => {
                const firstVariant = product?.variants?.[0];
                const matchingPrice = firstVariant?.prices?.find(
                    (p) => p.currency_code === preferredCurrency
                );
                return matchingPrice
                    ? formatCryptoPrice(
                          Number(matchingPrice.amount),
                          preferredCurrency ?? 'eth'
                      )
                    : '';
            })(),
            variants: product?.variants?.map((variant) => ({
                id: variant.id,
                product_id: variant.product_id,
                title: variant.title || '',
                sku: variant.sku || '',
                weight: variant.weight || 0,
                length: variant.length || 0,
                height: variant.height || 0,
                width: variant.width || 0,
                price: (() => {
                    const matchingPrice = variant.prices?.find(
                        (p) => p.currency_code === preferredCurrency
                    );
                    return matchingPrice
                        ? formatCryptoPrice(
                              Number(matchingPrice.amount || '0'),
                              preferredCurrency ?? 'eth'
                          )
                        : '';
                })(),

                inventory_quantity: variant.inventory_quantity || 0, // If you want to track quantity
            })),
        },
        // validators: (values) => {
        //     const result = ProductSchema.safeParse(values);
        //     return result.success ? {} : result.error.format();
        // },
        // validators: (values) => {
        //     const result = ProductSchema.safeParse(values);
        //     const errors = result.success ? {} : result.error.format();
        //
        //     // Additional SQL injection validation
        //     Object.entries(values).forEach(([key, value]) => {
        //         if (typeof value === 'string') {
        //             const error = validateInput(key, value);
        //             if (error) errors[key] = [error];
        //         }
        //     });
        //
        //     return errors;
        // },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product data</div>;

    return (
        <div className="min-h-screen px-8 py-12 text-white">
            {/*Back Button*/}
            <div className="max-w-4xl mx-auto mb-4">
                <Button
                    className="bg-[#1A1A1A] p-8 rounded-lg shadow-md mt-4 justify-end"
                    variant="ghost"
                    onClick={() => navigate({ to: '/products' })}
                >
                    Back to All Products
                    <PackageSearch size={18} />
                </Button>
            </div>

            {/*Edit Product Form*/}
            <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-md mt-4">
                <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editProductForm.handleSubmit();
                    }}
                >
                    {/*General Information Section*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black p-[24px] my-8 rounded">
                        {/* Product Information */}
                        <div>
                            <h2 className="text-2xl font-medium mb-4">
                                General Information
                            </h2>

                            <editProductForm.Field
                                name="title"
                                validators={{
                                    onBlur: ({ value }) =>
                                        value?.trim().length === 0
                                            ? 'Product name is required.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <>
                                        <Label>Product Name</Label>
                                        <Input
                                            placeholder="Product Name"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                        />
                                        {field.state.meta.errors?.length >
                                            0 && (
                                            <span className="text-red-500 mt-1 mb-4 block">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                            </editProductForm.Field>

                            {/* Subtitle */}
                            <editProductForm.Field
                                name="subtitle"
                                validators={{
                                    onBlur: ({ value }) =>
                                        value?.trim().length > 200
                                            ? 'Subtitle must not exceed 200 characters.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <>
                                        <Label>Product Information</Label>
                                        <Input
                                            placeholder="Subtitle"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                        />
                                        {field.state.meta.errors?.length >
                                            0 && (
                                            <span className="text-red-500 mt-1 mb-4 block">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                            </editProductForm.Field>

                            {/* Description */}
                            <editProductForm.Field
                                name="description"
                                validators={{
                                    onBlur: ({ value }) =>
                                        value?.trim().length === 0
                                            ? 'Description is required.'
                                            : undefined,
                                }}
                            >
                                {(field) => (
                                    <>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Description"
                                            rows={10}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                        />
                                        {field.state.meta.errors?.length >
                                            0 && (
                                            <span className="text-red-500 mt-1 mb-4 block">
                                                {field.state.meta.errors.join(
                                                    ', '
                                                )}
                                            </span>
                                        )}
                                    </>
                                )}
                            </editProductForm.Field>
                        </div>

                        {/* Right side fields */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">
                                Product Media
                            </h2>
                            {/* Thumbnail */}
                            <div>
                                <editProductForm.Field
                                    name="thumbnail"
                                    validators={{
                                        onBlur: ({ value }) => {
                                            if (!value)
                                                return 'Thumbnail URL is required.';
                                            try {
                                                new URL(value); // Validate if it's a valid URL
                                                return undefined;
                                            } catch {
                                                return 'Invalid URL format.';
                                            }
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <>
                                            <Label>Thumbnail URL</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        uploadThumbnailMutation.mutate(
                                                            e.target.files[0]
                                                        );
                                                    }
                                                }}
                                            />
                                            {field.state.meta.errors?.length >
                                                0 && (
                                                <span className="text-red-500 mt-1">
                                                    {field.state.meta.errors.join(
                                                        ', '
                                                    )}
                                                </span>
                                            )}
                                            {field.state.value && (
                                                <img
                                                    src={field.state.value}
                                                    alt="Thumbnail Preview"
                                                    className="object-cover rounded-md mx-auto max-w-[200px] max-h-[200px] mt-4"
                                                />
                                            )}
                                        </>
                                    )}
                                </editProductForm.Field>
                                {/* Thumbnail Upload Button */}
                                <Button
                                    className="mt-2"
                                    onClick={() => setImageDialogOpen(true)} // Open Dialog
                                >
                                    Upload Image
                                </Button>

                                {/* Image Upload Dialog */}
                                <ImageUploadDialog
                                    open={isImageDialogOpen}
                                    onClose={() => setImageDialogOpen(false)}
                                    onImageUpload={handleImageUpload} // Pass uploaded image URL back to the form
                                    storeHandle={storeHandle}
                                />
                            </div>
                            {/* Show current categories & an "Add Category" button */}
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex justify-end">
                                    <Label className="text-lg font-medium">
                                        Categories:
                                    </Label>
                                </div>

                                {/* Show the product's existing categories (if your `product` object has them) */}
                                <div className="flex justify-end">
                                    {product?.categories?.length ? (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.categories.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="px-2 py-1 rounded bg-gray-700 text-white"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-gray-400">
                                            No categories yet.
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        className="mt-2"
                                        onClick={() => {
                                            alert(
                                                'TODO: Add Category flow here.'
                                            );
                                        }}
                                    >
                                        Add New Category
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferred Currency */}
                    <div className="bg-black p-[24px] rounded">
                        <h2 className="text-2xl font-bold">Pricing</h2>

                        <div className="my-4 font-semibold">
                            Preferred Currency:{' '}
                            {preferredCurrency?.toUpperCase() ?? 'ETH'}
                        </div>
                        {/* Dynamic Variant Fields */}
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
                                            className="my-2"
                                        >
                                            <AccordionTrigger>
                                                Variant #{index + 1}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-700 py-2">
                                                    {/* Variant ID HIDDEN*/}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].id`}
                                                    >
                                                        {(field) => (
                                                            <input
                                                                type="hidden"
                                                                value={
                                                                    field.state
                                                                        .value
                                                                }
                                                            />
                                                        )}
                                                    </editProductForm.Field>

                                                    {/* Variant Title */}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].title`}
                                                        validators={{
                                                            onBlur: ({
                                                                value,
                                                            }) => {
                                                                if (
                                                                    !value ||
                                                                    value.trim()
                                                                        .length ===
                                                                        0
                                                                ) {
                                                                    return 'Title is required.';
                                                                }
                                                                if (
                                                                    value.trim()
                                                                        .length <
                                                                    1
                                                                ) {
                                                                    return 'Title must be at least 1 character long.';
                                                                }
                                                                if (
                                                                    !value ||
                                                                    value.trim()
                                                                        .length ===
                                                                        0
                                                                ) {
                                                                    return 'Title is required.';
                                                                }

                                                                return undefined;
                                                            },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    Title
                                                                </Label>
                                                                <Input
                                                                    placeholder="Variant Title"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onBlur={
                                                                        field.handleBlur
                                                                    }
                                                                />
                                                                {field.state
                                                                    .meta.errors
                                                                    ?.length >
                                                                    0 && (
                                                                    <span className="text-red-500 mt-1 block">
                                                                        {field.state.meta.errors.join(
                                                                            ', '
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    {/* Variant SKU */}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].sku`}
                                                        key={`sku-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    SKU
                                                                </Label>
                                                                <Input
                                                                    placeholder="SKU"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value ||
                                                                        variant.sku ||
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    {/* Quantity */}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].inventory_quantity`}
                                                        key={`inventory_quantity-${variant.id}`}
                                                        validators={{
                                                            onBlur: ({
                                                                value,
                                                            }) => {
                                                                if (
                                                                    value ===
                                                                    undefined
                                                                ) {
                                                                    return 'Quantity is required.';
                                                                }
                                                                if (value < 0) {
                                                                    return 'Quantity cannot be negative.';
                                                                }
                                                                if (
                                                                    value === 0
                                                                ) {
                                                                    return 'Quantity cannot be zero';
                                                                }
                                                                return undefined;
                                                            },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    Quantity
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Quantity"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value ||
                                                                        variant.inventory_quantity ||
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    onBlur={
                                                                        field.handleBlur
                                                                    }
                                                                />
                                                                {field.state
                                                                    .meta.errors
                                                                    ?.length >
                                                                    0 && (
                                                                    <span className="text-red-500 mt-1 block">
                                                                        {field.state.meta.errors.join(
                                                                            ', '
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>
                                                    <editProductForm.Field
                                                        name={`variants[${index}].price`}
                                                        key={`price-${variant.id}`}
                                                        validators={{
                                                            onBlur: ({
                                                                value,
                                                            }) => {
                                                                // Convert the union string | number to a number
                                                                const numericValue =
                                                                    Number(
                                                                        value
                                                                    );

                                                                // If value is undefined or NaN, handle that first
                                                                if (
                                                                    value ===
                                                                        undefined ||
                                                                    isNaN(
                                                                        numericValue
                                                                    )
                                                                ) {
                                                                    return 'Price is required and must be a number.';
                                                                }

                                                                if (
                                                                    numericValue <
                                                                    0
                                                                ) {
                                                                    return 'Price cannot be negative.';
                                                                }
                                                                if (
                                                                    numericValue ===
                                                                    0
                                                                ) {
                                                                    return 'Price cannot be zero.';
                                                                }

                                                                // No validation errors
                                                                return undefined;
                                                            },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    Price in{' '}
                                                                    {[
                                                                        'usdc',
                                                                        'usdt',
                                                                    ].includes(
                                                                        preferredCurrency?.toLowerCase() ??
                                                                            ''
                                                                    )
                                                                        ? 'USD'
                                                                        : (preferredCurrency?.toUpperCase() ??
                                                                          'ETH')}
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Price"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                    onBlur={
                                                                        field.handleBlur
                                                                    }
                                                                />
                                                                {field.state
                                                                    .meta.errors
                                                                    ?.length >
                                                                    0 && (
                                                                    <span className="text-red-500 mt-1 block">
                                                                        {field.state.meta.errors.join(
                                                                            ', '
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4 mt-4">
                                                    <editProductForm.Field
                                                        name={`variants[${index}].weight`}
                                                        key={`weight-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label className="block text-sm font-medium">
                                                                    Weight (g)
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    <editProductForm.Field
                                                        name={`variants[${index}].length`}
                                                        key={`length-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label className="block text-sm font-medium">
                                                                    Length (cm)
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    <editProductForm.Field
                                                        name={`variants[${index}].height`}
                                                        key={`height-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label className="block text-sm font-medium">
                                                                    Height (cm)
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    <editProductForm.Field
                                                        name={`variants[${index}].width`}
                                                        key={`width-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label className="block text-sm font-medium">
                                                                    Width (cm)
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        field.handleChange(
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}

                        <div className="fixed bottom-0 left-0 w-full bg-black px-8 py-4 border-t border-gray-700">
                            <div className="mx-auto w-[880px] flex justify-between">
                                <Button
                                    variant="ghost"
                                    className="hover:bg-primary-green-900 w-[180px] h-[44px] px-[24px] py-[16px]"
                                    onClick={() =>
                                        navigate({ to: '/products' })
                                    }
                                >
                                    Back to All Products
                                    <PackageSearch size={18} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="hover:bg-primary-green-900 w-[180px] h-[44px] px-[24px] py-[16px]"
                                    onClick={() => navigate({ to: '/' })}
                                >
                                    Change Currency
                                    <Bitcoin size={18} />
                                </Button>

                                <editProductForm.Subscribe
                                    selector={(formState) => {
                                        let dirtyFields: Record<
                                            string,
                                            unknown
                                        > = {};
                                        const dirtyVariantIndices =
                                            new Set<number>();

                                        for (const [
                                            fieldName,
                                            fieldMeta,
                                        ] of Object.entries(
                                            formState.fieldMeta
                                        )) {
                                            if (!fieldMeta.isDirty) continue;

                                            // If variant field:
                                            const match =
                                                fieldName.match(
                                                    /^variants\[(\d+)\]/
                                                );
                                            if (match) {
                                                dirtyVariantIndices.add(
                                                    Number(match[1])
                                                );
                                            }

                                            // Set the changed value in dirtyFields
                                            const currentValue = getBy(
                                                formState.values,
                                                fieldName
                                            );
                                            dirtyFields = setBy(
                                                dirtyFields,
                                                fieldName,
                                                currentValue
                                            );
                                        }

                                        // Build array of only the changed variants:
                                        const dirtyVariantArray: any[] = [];
                                        for (const index of dirtyVariantIndices) {
                                            const variantData =
                                                formState.values.variants?.[
                                                    index
                                                ];
                                            if (variantData) {
                                                dirtyVariantArray.push(
                                                    variantData
                                                );
                                            }
                                        }

                                        return {
                                            dirtyVariantArray,
                                            dirtyFields,
                                            canSubmit: formState.canSubmit,
                                            isSubmitting:
                                                formState.isSubmitting,
                                        };
                                    }}
                                >
                                    {({
                                        dirtyVariantArray,
                                        dirtyFields,
                                        canSubmit,
                                        isSubmitting,
                                    }) => {
                                        const handleSubmit = async () => {
                                            // If nothing is dirty at all:
                                            if (
                                                Object.keys(dirtyFields)
                                                    .length === 0 &&
                                                dirtyVariantArray.length === 0
                                            ) {
                                                toast({
                                                    variant: 'default',
                                                    title: 'No Changes!',
                                                    description:
                                                        'No Changes to submit',
                                                });
                                                return;
                                            }

                                            // Because `dirtyVariantArray` is the array of changed variants,
                                            // and `dirtyFields.variants` might have an object representation,
                                            // you'll typically remove `dirtyFields.variants` so they don't conflict:
                                            if (dirtyFields.variants) {
                                                delete (dirtyFields as any)
                                                    .variants;
                                            }

                                            // Merge top-level dirtyFields + dirtyVariantArray
                                            const payload = {
                                                ...dirtyFields, // merges title, thumbnail, description, etc.
                                                variants: dirtyVariantArray, // replaced with changed variants only
                                                preferredCurrency,
                                            };

                                            console.log(
                                                'Final Payload:',
                                                payload
                                            );
                                            updateEditForm.mutate(payload);
                                        };

                                        return (
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={
                                                    !canSubmit || isSubmitting
                                                }
                                            >
                                                Save Changes
                                            </Button>
                                        );
                                    }}
                                </editProductForm.Subscribe>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
