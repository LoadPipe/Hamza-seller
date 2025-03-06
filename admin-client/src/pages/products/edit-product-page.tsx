import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { fetchProductById } from '@/pages/products/api/product-by-id.ts';
import { updateProductById } from '@/pages/products/api/update-product-by-id.ts';
import { validateSku, validateBarcode, validateEan, validateUpc } from '@/pages/products/api/validate-product-fields.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { QuillEditor } from '@/components/ui/quill-editor';
import { PackageSearch, Bitcoin, Trash } from 'lucide-react';
import ImageUploadDialog from '@/pages/products/utils/image-upload-dialog.tsx';
import { useState } from 'react';
import GalleryUploadDialog from '@/pages/products/utils/gallery-upload-dialog.tsx';
import {
    deleteImageFromCDN,
    deleteImageFromdB,
} from '@/pages/products/api/upload-gallery-images.ts';
import VariantUploadDialog from '@/pages/products/utils/variant-upload-dialog.tsx';

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

    // Fetch product data
    const { data, isLoading, error } = useQuery<FetchProductResponse, Error>({
        queryKey: ['view-product-form', productId],
        queryFn: () => fetchProductById(productId),
    });

    const [isImageDialogOpen, setImageDialogOpen] = useState(false);

    // Handle Thumbnail Upload
    const handleThumbnailUpload = (imageUrl: string) => {
        editProductForm.setFieldValue('thumbnail', imageUrl);
        updateEditForm.mutate({ thumbnail: imageUrl, preferredCurrency });
    };

    const [isGalleryDialogOpen, setGalleryDialogOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Handle Gallery Upload
    const handleGalleryUpload = (uploadedImageUrls: string[]) => {
        const updatedGallery = [...galleryImages, ...uploadedImageUrls];
        setGalleryImages(updatedGallery);

        // Mutate backend (optional: depends if you want to update product immediately)
        updateEditForm.mutate({ images: updatedGallery, preferredCurrency });
    };

    // The following section is variant image logic
    const [variantDialogOpen, setVariantDialogOpen] = useState(false);
    const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

    const openVariantUploadDialog = (index: number) => {
        setCurrentVariantIndex(index);
        setVariantDialogOpen(true);
    };

    const handleVariantImageUpload = (
        imageUrl: string,
        variantIndex: number
    ) => {
        // Update the variant's metadata in your form.
        editProductForm.setFieldValue(`variants[${variantIndex}].metadata`, {
            imgUrl: imageUrl,
        });

        // Create a sanitized copy of variants where we remove problematic fields like an empty SKU.
        const sanitizedVariants = editProductForm?.state?.values?.variants?.map(
            (variant) => ({
                ...variant,
                metadata: variant.metadata || {}, // Replace null with an empty object
                sku:
                    variant.sku && variant.sku.trim() !== ''
                        ? variant.sku
                        : undefined,
            })
        );

        const payload = {
            ...editProductForm.state.values,
            variants: sanitizedVariants,
            preferredCurrency,
        };

        updateEditForm.mutate(payload);
    };

    // ---- End of Variant Image Upload / handing logic

    const cachedStore = queryClient.getQueryData<{ handle: string }>([
        'store',
        getJwtStoreId(),
    ]);

    const storeHandle = cachedStore?.handle ?? '';

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
                barcode: variant.barcode || '',
                ean: variant.ean || '',
                upc: variant.upc || '',
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
                metadata: variant.metadata || {},
                inventory_quantity: variant.inventory_quantity || 0, // If you want to track quantity
            })),
        },
        // validators: {
        //     onSubmitAsync: async ({ value }) => {
        //         const errors: Record<string, string> = {};
        //         if (value.variants) {
        //             for (let i = 0; i < value.variants.length; i++) {
        //                 const sku = value.variants[i].sku;
        //                 const defaultSku = editProductForm.getFieldValue.name;
        //
        //                 if (sku.trim() === '') {
        //                     errors[`variants[${i}].sku`] = 'SKU is required.';
        //                 } else if (sku !== defaultSku) {
        //                     try {
        //                         const response = await validateSku(Number(sku));
        //                         if (response.data === false) {
        //                             errors[`variants[${i}].sku`] =
        //                                 'SKU already exists eh?';
        //                         }
        //                     } catch (error: any) {
        //                         errors[`variants[${i}].sku`] =
        //                             error.message || 'Failed to validate SKU';
        //                     }
        //                 }
        //             }
        //         }
        //         return Object.keys(errors).length
        //             ? { fields: errors }
        //             : undefined;
        //     },
        // },
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

    const deleteImageMutation = useMutation({
        mutationFn: async ({
            imageUrl,
            imageId,
        }: {
            imageUrl: string;
            imageId: string;
        }) => {
            try {
                await deleteImageFromCDN(imageUrl);
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    throw error;
                }
                console.warn(
                    'CDN image not found, skipping deletion:',
                    imageUrl
                );
            }
            await deleteImageFromdB(imageId);
            return imageUrl;
        },
        onMutate: async ({ imageUrl }) => {
            await queryClient.cancelQueries({
                queryKey: ['view-product-form', productId],
            });
            const previousData = queryClient.getQueryData<FetchProductResponse>(
                ['view-product-form', productId]
            );
            if (previousData) {
                queryClient.setQueryData<FetchProductResponse>(
                    ['view-product-form', productId],
                    {
                        ...previousData,
                        product: {
                            ...previousData.product,
                            images: previousData.product.images.filter(
                                (img) => img.url !== imageUrl
                            ),
                        },
                    }
                );
            }
            setGalleryImages((prev) => prev.filter((url) => url !== imageUrl));
            return { previousData };
        },
        onError: (error, variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ['view-product-form', productId],
                    context.previousData
                );
            }
            console.log(variables);
            toast({
                title: 'Error',
                description: `Failed to delete image, ${error.message}`,
                variant: 'destructive',
            });
        },
        onSuccess: (deletedImageUrl) => {
            toast({
                title: 'Deleted',
                description: `Removed ${deletedImageUrl} from gallery`,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['view-product-form', productId],
            });
        },
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
                                    onBlur: ({ value }) => {
                                        const trimmed = value?.trim() || '';
                                        if (trimmed.length === 0) {
                                            return 'Product name is required.';
                                        }
                                        if (trimmed.length > 200) {
                                            return 'Product name must be 200 characters or fewer.';
                                        }
                                        return undefined;
                                    },
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
                                        value?.trim().length > 1000
                                            ? 'Subtitle must not exceed 1000 characters.'
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
                                    onBlur: ({ value }) => {
                                        const trimmed = value?.trim() || '';
                                        if (trimmed.length === 0) {
                                            return 'Description is required.';
                                        }
                                        const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
                                        if (wordCount > 3000) {
                                            return 'Description must not exceed 3000 words.';
                                        }
                                        return undefined;
                                    },
                                }}
                            >
                                {(field) => (
                                    <>
                                        <Label>Description</Label>
                                        <QuillEditor
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            className="mb-4"
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
                            {/* Thumbnail */}
                            <div className="mb-6">
                                <h2 className="text-lg font-medium mb-4">
                                    Product Media
                                </h2>

                                {/* Show Thumbnail Preview if Available */}
                                <editProductForm.Subscribe
                                    selector={(formState) =>
                                        formState.values.thumbnail
                                    }
                                >
                                    {(thumbnail) =>
                                        thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt="Thumbnail Preview"
                                                className="object-cover rounded-md mx-auto max-w-[200px] max-h-[200px] mb-4"
                                            />
                                        ) : (
                                            <p className="text-gray-400 text-sm text-center">
                                                No image selected
                                            </p>
                                        )
                                    }
                                </editProductForm.Subscribe>

                                {/* Upload Image Button */}
                                <div className="flex justify-center">
                                    <Button
                                        className="mt-2"
                                        onClick={() => setImageDialogOpen(true)} // Open Dialog
                                    >
                                        Upload Thumbnail Image
                                    </Button>
                                </div>

                                {/* Image Upload Dialog */}
                                <ImageUploadDialog
                                    open={isImageDialogOpen}
                                    onClose={() => setImageDialogOpen(false)}
                                    onImageUpload={handleThumbnailUpload} // Pass uploaded image URL back to the form
                                    storeHandle={storeHandle}
                                    productId={productId}
                                />
                                {/* Gallery Section */}
                                <div className="mt-6">
                                    <h2 className="text-lg font-medium mb-4">
                                        Gallery
                                    </h2>

                                    {/* Open Upload Dialog */}
                                    <Button
                                        onClick={() =>
                                            setGalleryDialogOpen(true)
                                        }
                                    >
                                        Upload Gallery Images
                                    </Button>

                                    {/* Display Gallery Images */}
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {product?.images?.map((image) => (
                                            <div
                                                key={image.id}
                                                className="relative group"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt="Gallery"
                                                    className="rounded-lg object-cover w-full h-32"
                                                />
                                                <button
                                                    onClick={() =>
                                                        deleteImageMutation.mutate(
                                                            {
                                                                imageUrl:
                                                                    image.url,
                                                                imageId:
                                                                    image.id,
                                                            }
                                                        )
                                                    }
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upload Dialog */}
                                    <GalleryUploadDialog
                                        open={isGalleryDialogOpen}
                                        onClose={() =>
                                            setGalleryDialogOpen(false)
                                        }
                                        onGalleryUpload={handleGalleryUpload}
                                        storeHandle={storeHandle}
                                        productId={productId}
                                        currentGallery={product?.images ?? []} // Now an array of { id: string; url: string }
                                        onDeleteImage={(image) => {
                                            if (!image?.id) {
                                                toast({
                                                    title: 'Error',
                                                    description:
                                                        'Image ID not found for deletion.',
                                                    variant: 'destructive',
                                                });
                                                return;
                                            }
                                            deleteImageMutation.mutate({
                                                imageUrl: image.url,
                                                imageId: image.id,
                                            });
                                        }}
                                    />
                                </div>
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
                                                <div className="flex items-center justify-between border-b border-gray-700 py-2 mb-4">
                                                    <div className="flex items-center gap-4">
                                                        {variant.metadata
                                                            ?.imgUrl ? (
                                                            <img
                                                                src={
                                                                    variant
                                                                        .metadata
                                                                        .imgUrl
                                                                }
                                                                alt={`Variant ${index + 1}`}
                                                                className="w-16 h-16 rounded"
                                                            />
                                                        ) : null}
                                                        <span className="text-lg font-medium">
                                                            Variant {index + 1}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            openVariantUploadDialog(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Upload Variant Image
                                                    </Button>
                                                    {variantDialogOpen && (
                                                        <VariantUploadDialog
                                                            open={
                                                                variantDialogOpen
                                                            }
                                                            onClose={() =>
                                                                setVariantDialogOpen(
                                                                    false
                                                                )
                                                            }
                                                            variantIndex={
                                                                currentVariantIndex
                                                            }
                                                            storeHandle={
                                                                storeHandle
                                                            }
                                                            productId={
                                                                productId
                                                            }
                                                            onVariantImageUpload={
                                                                handleVariantImageUpload
                                                            }
                                                        />
                                                    )}
                                                </div>
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
                                                        asyncDebounceMs={100}
                                                        validators={{
                                                            // Synchronous check: ensure a value exists
                                                            onBlur: () => { return undefined },
                                                            // Asynchronous check: call your API only if the SKU has changed
                                                            onChangeAsync:
                                                                async ({
                                                                           value,
                                                                       }) => {
                                                                    // Compare with the default SKU. If unchanged, skip the API call.
                                                                    if (value.trim() === '') return undefined;
                                                                    try {
                                                                        const response =
                                                                            await validateSku(
                                                                                (
                                                                                    value.toString()
                                                                                ),
                                                                                editProductForm.getFieldValue(
                                                                                    `variants[${index}].id`
                                                                                )
                                                                            );

                                                                        if (
                                                                            response ===
                                                                            false
                                                                        ) {
                                                                            return 'SKU already exists';
                                                                        }
                                                                        return undefined;
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Failed to validate SKU:',
                                                                            error
                                                                        );

                                                                        return 'Failed to validate SKU';
                                                                    }
                                                                },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    SKU
                                                                </Label>
                                                                <Tooltip
                                                                    open={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0
                                                                    }
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Input
                                                                            placeholder="SKU"
                                                                            value={
                                                                                field
                                                                                    .state
                                                                                    .value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                field.handleChange(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            onBlur={
                                                                                field.handleBlur
                                                                            }
                                                                        />
                                                                    </TooltipTrigger>
                                                                    {field.state
                                                                        .meta
                                                                        .errors
                                                                        .length >
                                                                        0 && (
                                                                        <TooltipContent>
                                                                            <span className="text-red-500">
                                                                                {field.state.meta.errors.join(
                                                                                    ', '
                                                                                )}
                                                                            </span>
                                                                        </TooltipContent>
                                                                    )}
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    {/* Variant Barcode */}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].barcode`}
                                                        asyncDebounceMs={100}
                                                        validators={{
                                                            // Synchronous check: ensure a value exists
                                                            onBlur: () => { return undefined },
                                                            // Asynchronous check: call your API only if the Barcode has changed
                                                            onChangeAsync:
                                                                async ({
                                                                           value,
                                                                       }) => {
                                                                    // Compare with the default SKU. If unchanged, skip the API call.
                                                                    if (value.trim() === '') return undefined;
                                                                    try {
                                                                        const response =
                                                                            await validateBarcode(
                                                                                (value.toString()),
                                                                                editProductForm.getFieldValue(
                                                                                    `variants[${index}].id`
                                                                                )
                                                                            );

                                                                        if (
                                                                            response ===
                                                                            false
                                                                        ) {
                                                                            return 'Barcode already exists';
                                                                        }
                                                                        return undefined;
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Failed to validate Barcode:',
                                                                            error
                                                                        );

                                                                        return 'Failed to validate Barcode';
                                                                    }
                                                                },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    Barcode
                                                                </Label>
                                                                <Tooltip
                                                                    open={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0
                                                                    }
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Input
                                                                            placeholder="Barcode"
                                                                            value={
                                                                                field
                                                                                    .state
                                                                                    .value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                field.handleChange(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            onBlur={
                                                                                field.handleBlur
                                                                            }
                                                                        />
                                                                    </TooltipTrigger>
                                                                    {field.state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0 && (
                                                                            <TooltipContent>
                                                                            <span className="text-red-500">
                                                                                {field.state.meta.errors.join(
                                                                                    ', '
                                                                                )}
                                                                            </span>
                                                                            </TooltipContent>
                                                                        )}
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>

                                                    {/* Variant EAN */}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].ean`}
                                                        asyncDebounceMs={100}
                                                        validators={{
                                                            // Synchronous check: ensure a value exists
                                                            // Allow empty value on blur
                                                            onBlur: () => { return undefined },
                                                            // Asynchronous check: call your API only if the Barcode has changed
                                                            onChangeAsync:
                                                                async ({
                                                                           value,
                                                                       }) => {
                                                                    // Compare with the default SKU. If unchanged, skip the API call.
                                                                    if (value.trim() === '') return undefined;
                                                                    try {
                                                                        const response =
                                                                            await validateEan(
                                                                                (value.toString()),
                                                                                editProductForm.getFieldValue(
                                                                                    `variants[${index}].id`
                                                                                )
                                                                            );

                                                                        if (
                                                                            response ===
                                                                            false
                                                                        ) {
                                                                            return 'EAN already exists';
                                                                        }
                                                                        return undefined;
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Failed to validate EAN:',
                                                                            error
                                                                        );

                                                                        return 'Failed to validate EAN';
                                                                    }
                                                                },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    EAN
                                                                </Label>
                                                                <Tooltip
                                                                    open={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0
                                                                    }
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Input
                                                                            placeholder="EAN"
                                                                            value={
                                                                                field
                                                                                    .state
                                                                                    .value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                field.handleChange(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            onBlur={
                                                                                field.handleBlur
                                                                            }
                                                                        />
                                                                    </TooltipTrigger>
                                                                    {field.state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0 && (
                                                                            <TooltipContent>
                                                                            <span className="text-red-500">
                                                                                {field.state.meta.errors.join(
                                                                                    ', '
                                                                                )}
                                                                            </span>
                                                                            </TooltipContent>
                                                                        )}
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>


                                                    {/* Variant UPC*/}
                                                    <editProductForm.Field
                                                        name={`variants[${index}].upc`}
                                                        asyncDebounceMs={100}
                                                        validators={{
                                                            // Allow empty value on blur
                                                            onBlur: () => { return undefined },
                                                            // Asynchronous check: call your API only if the UPC has changed
                                                            onChangeAsync:
                                                                async ({
                                                                           value,
                                                                       }) => {
                                                                    // Compare with the default UPC. If unchanged, skip the API call.
                                                                    if (value.trim() === '') return undefined;
                                                                    try {
                                                                        const response =
                                                                            await validateUpc(
                                                                                (value.toString()),
                                                                                editProductForm.getFieldValue(
                                                                                    `variants[${index}].id`
                                                                                )
                                                                            );

                                                                        if (
                                                                            response ===
                                                                            false
                                                                        ) {
                                                                            return 'UPC already exists';
                                                                        }
                                                                        return undefined;
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Failed to validate UPC:',
                                                                            error
                                                                        );

                                                                        return 'Failed to validate UPC';
                                                                    }
                                                                },
                                                        }}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    UPC
                                                                </Label>
                                                                <Tooltip
                                                                    open={
                                                                        field
                                                                            .state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0
                                                                    }
                                                                >
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <Input
                                                                            placeholder="UPC"
                                                                            value={
                                                                                field
                                                                                    .state
                                                                                    .value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                field.handleChange(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                );
                                                                            }}
                                                                            onBlur={
                                                                                field.handleBlur
                                                                            }
                                                                        />
                                                                    </TooltipTrigger>
                                                                    {field.state
                                                                            .meta
                                                                            .errors
                                                                            .length >
                                                                        0 && (
                                                                            <TooltipContent>
                                                                            <span className="text-red-500">
                                                                                {field.state.meta.errors.join(
                                                                                    ', '
                                                                                )}
                                                                            </span>
                                                                            </TooltipContent>
                                                                        )}
                                                                </Tooltip>
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
                                            // Motivation: Validation errors only show when the variant's accordion section is
                                            // expanded, but they don't properly show when you submit the form
                                            // which makes the UX bad...

                                            // onBlur field only triggers when a user interacts with the field
                                            // Since only one variant can be expanded at a time, errors are hidden when submitting

                                            // TODO: FORM VALIDATION IS INCOMPLETE FOR EAN UPC BARCODE...
                                            // const validationErrors = await editProductForm.validate();
                                            //
                                            //
                                            // if (Object.keys(validationErrors).length > 0) {
                                            //     const firstInvalidVariantIndex = product.variants.findIndex((_, i) =>
                                            //         Object.keys(validationErrors).some((errorField) =>
                                            //             errorField.startsWith(`variants[${i}]`)
                                            //         )
                                            //     );
                                            //
                                            //     if (firstInvalidVariantIndex !== -1) {
                                            //         setOpenAccordionItem(`variant-${firstInvalidVariantIndex}`);
                                            //     }
                                            //
                                            //     toast({
                                            //         variant: "destructive",
                                            //         title: "Validation Errors",
                                            //         description: "Please fix the errors before submitting.",
                                            //     });
                                            //
                                            //     return;
                                            // }


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
