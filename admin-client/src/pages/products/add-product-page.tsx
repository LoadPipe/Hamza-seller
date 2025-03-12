import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuillEditor } from '@/components/ui/quill-editor';
import { useToast } from '@/hooks/use-toast.ts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { createProduct } from '@/pages/products/api/add-product/create-product';
import { Bitcoin, PackageSearch } from 'lucide-react';
import { ProductStatus } from '@/utils/status-enum';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { validateSku, validateBarcode, validateEan, validateUpc } from '@/pages/products/api/validate-product-fields.ts';
import { useForm, getBy, setBy } from '@tanstack/react-form';
import GalleryAddUploadDialog from './utils/add-product/gallery-add-upload-dialog';
import ImageAddUploadDialog from './utils/add-product/image-add-upload-dialog';
import VariantAddUploadDialog from './utils/add-product/variant-add-upload-dialog';
import { getJwtStoreId } from '@/utils/authentication';
import { useUserAuthStore } from '@/stores/authentication/user-auth';

interface GalleryImage {
    id: string;
    url: string;
    fileName: string;
}

export default function AddProductPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const cachedStore = queryClient.getQueryData<{ handle: string }>([
        'store',
        getJwtStoreId(),
    ]);

    const storeHandle = cachedStore?.handle ?? '';

    const preferredCurrency = useUserAuthStore(
        (state) => state.preferred_currency_code ?? 'eth'
    );

    // Maintain gallery images as an array of GalleryImage objects.
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [isThumbnailDialogOpen, setThumbnailDialogOpen] = useState(false);
    const [isGalleryDialogOpen, setGalleryDialogOpen] = useState(false);
    const [isVariantDialogOpen, setVariantDialogOpen] = useState(false);
    const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
    const { toast } = useToast();

    const addProductForm = useForm({
        defaultValues: {
            title: '',
            subtitle: '',
            description: '',
            thumbnail: '',
            weight: 0,
            length: 0,
            height: 0,
            width: 0,
            basePrice: '',
            status: ProductStatus.DRAFT,
            discountPercentage: '',
            sku: '',
            barcode: '',
            quantity: '',
            category: '',
            productTags: '',
            variants: [
                {
                    id: '',
                    product_id: '',
                    title: '',
                    sku: '',
                    barcode: '',
                    ean: '',
                    upc: '',
                    weight: 0,
                    length: 0,
                    height: 0,
                    width: 0,
                    price: '',
                    metadata: { imgUrl: '' },
                    inventory_quantity: 0,
                },
            ],
            images: [] as GalleryImage[],
        },
    });

    const handleAddVariant = () => {
        const newVariant = {
            id: '',
            product_id: '',
            title: '',
            sku: '',
            barcode: '',
            ean: '',
            upc: '',
            weight: 0,
            length: 0,
            height: 0,
            width: 0,
            price: '',
            metadata: { imgUrl: '' },
            inventory_quantity: 0,
        };
        addProductForm.setFieldValue('variants', [
            ...addProductForm.state.values.variants,
            newVariant,
        ]);
    };

    const handleRemoveVariant = (indexToRemove: number) => {
        const updatedVariants = addProductForm.state.values.variants.filter(
            (_: any, index: number) => index !== indexToRemove
        );
        addProductForm.setFieldValue('variants', updatedVariants);
    };

    const getProductFolder = () => {
        const title = addProductForm.state.values.title;
        if (!title || title.trim() === '') {
            toast({
                variant: 'destructive',
                title: 'Missing Product Name',
                description: 'Please fill in the product name before uploading images.',
            });
            return null;
        }
        return title.trim();
    };

    // Mutation for creating a product.
    const addProductMutation = useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                throw new Error('No product data provided.');
            }
            return createProduct(payload);
        },
        onSuccess: () => {
            // Use an object with queryKey to satisfy the type.
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate({ to: '/products' });
        },
        onError: (error: any) => {
            console.error('Error creating product:', error);
        },
    });

    const openVariantUploadDialog = (index: number) => {
        setCurrentVariantIndex(index);
        setVariantDialogOpen(true);
    };


    const handleVariantImageUpload = (
        imageUrl: string,
        variantIndex: number
    ) => {
        // Update the variant's metadata in your form.
        addProductForm.setFieldValue(`variants[${variantIndex}].metadata`, {
            imgUrl: imageUrl,
        });

        const sanitizedVariants = addProductForm?.state?.values?.variants?.map(
            (variant) => ({
                ...variant,
                metadata: variant.metadata || {}, 
                sku:
                    variant.sku && variant.sku.trim() !== ''
                        ? variant.sku
                        : undefined,
            })
        );

        const payload = {
            ...addProductForm.state.values,
            variants: sanitizedVariants,
            preferredCurrency,
        };

        addProductMutation.mutate(payload);
    };



    // Handler for thumbnail upload.
    const handleThumbnailUpload = (imageUrl: string) => {
        addProductForm.setFieldValue('thumbnail', imageUrl);
    };

    const handleGalleryUpload = (uploadedImageUrls: string[]) => {
        const newGalleryImages: GalleryImage[] = uploadedImageUrls.map((url, index) => ({
            id: url, 
            url,
            fileName: `gallery_${Date.now()}_${index}`
        }));
        setGalleryImages([...galleryImages, ...newGalleryImages]);
    };

    const handleDeleteGalleryImage = (image: GalleryImage) => {
        setGalleryImages((prev) => prev.filter((img) => img.id !== image.id));
    };

    return (
        <div className="min-h-screen bg-black px-8 py-12 text-white">
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

            {/*Add Product Form*/}
            <div className="max-w-4xl mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-md mt-4">
                <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addProductForm.handleSubmit();
                    }}
                >
                    {/* General Information Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black p-[24px] my-8 rounded">
                        {/* General Information */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">General Information</h2>
                            <addProductForm.Field name="title">
                                {(field) => (
                                    <>
                                        <Label>Product Name</Label>
                                        <Input
                                            placeholder="Product Name"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="mb-4"
                                        />
                                        {field.state.meta.errors?.length > 0 && (
                                            <span className="text-red-500 mt-1 block">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </addProductForm.Field>
                            <addProductForm.Field name="subtitle">
                                {(field) => (
                                    <>
                                        <Label>Product Information</Label>
                                        <Input
                                            placeholder="Subtitle"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            className="mb-4"
                                        />
                                        {field.state.meta.errors?.length > 0 && (
                                            <span className="text-red-500 mt-1 block">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </addProductForm.Field>
                            <addProductForm.Field name="description">
                                {(field) => (
                                    <>
                                        <Label>Description</Label>
                                        <QuillEditor
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            className="mb-4"
                                        />
                                        {field.state.meta.errors?.length > 0 && (
                                            <span className="text-red-500 mt-1 block">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </addProductForm.Field>


                            <addProductForm.Field name="status">
                                {(field) => (
                                    <>
                                        <Label>Status</Label>
                                        <Select
                                            value={field.state.value}
                                            onValueChange={(newValue) => {
                                                if (newValue === '') return;
                                                field.handleChange(newValue as ProductStatus);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(ProductStatus).map((status: string) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {field.state.meta.errors?.length > 0 && (
                                            <span className="text-red-500 mt-1 mb-4 block">
                                                {field.state.meta.errors.join(', ')}
                                            </span>
                                        )}
                                    </>
                                )}
                            </addProductForm.Field>
                        </div>

                        {/* Product Media Section */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">Product Media</h2>
                            <div className="mb-6">
                                <addProductForm.Subscribe
                                    selector={(formState) => formState.values.thumbnail}
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
                                </addProductForm.Subscribe>
                                <div className="flex justify-center">
                                    <Button onClick={() => setThumbnailDialogOpen(true)}>
                                        Upload Thumbnail Image
                                    </Button>
                                </div>
                                <ImageAddUploadDialog
                                    open={isThumbnailDialogOpen}
                                    onClose={() => setThumbnailDialogOpen(false)}
                                    onImageUpload={handleThumbnailUpload}
                                    storeHandle={storeHandle}
                                    productFolder={getProductFolder() || ''} 
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium mb-4">Gallery</h2>
                                <Button onClick={() => setGalleryDialogOpen(true)}>
                                    Upload Gallery Images
                                </Button>
                                <GalleryAddUploadDialog
                                    open={isGalleryDialogOpen}
                                    onClose={() => setGalleryDialogOpen(false)}
                                    onGalleryUpload={handleGalleryUpload}
                                    productFolder={getProductFolder() || ''}
                                    storeHandle={storeHandle}
                                    currentGallery={galleryImages}
                                    onDeleteImage={handleDeleteGalleryImage}
                                />
                            </div>
                            <div className="mt-6 flex flex-col gap-4">
                                <div className="flex justify-end">
                                    <Label className="text-lg font-medium">
                                        Categories:
                                    </Label>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        className="mt-2"
                                        onClick={() => {
                                            alert('TODO: Add Category flow here.');
                                        }}
                                    >
                                        Add New Category
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-black p-[24px] rounded">
                        <h2 className="text-2xl font-bold">Pricing</h2>

                        <div className="my-4 font-semibold">
                            Preferred Currency: {preferredCurrency?.toUpperCase() ?? 'ETH'}
                        </div>

                        {/* Variant Fields */}
                        <div className="mt-8">
                            <div className="mt-8 flex items-center justify-between">
                                <h2 className="text-lg font-medium mb-4">Variants</h2>
                                <Button onClick={handleAddVariant}>Add Variant</Button>
                            </div>
                            <Accordion type="single" collapsible>
                                {addProductForm.state.values.variants?.map((variant, index) => (
                                    <AccordionItem
                                        key={variant.id || index}
                                        value={`variant-${index}`}
                                        className="my-2"
                                    >
                                        <AccordionTrigger>Variant #{index + 1}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex items-center justify-between border-b border-gray-700 py-2 mb-4">
                                                <div className="flex items-center gap-4">
                                                    {variant.metadata?.imgUrl ? (
                                                        <img
                                                            src={variant.metadata.imgUrl}
                                                            alt={`Variant ${index + 1}`}
                                                            className="w-16 h-16 rounded"
                                                        />
                                                    ) : null}
                                                    <span className="text-lg font-medium">
                                                        Variant {index + 1}
                                                    </span>
                                                </div>
                                                <Button onClick={() => openVariantUploadDialog(index)}>
                                                    Upload Variant Image
                                                </Button>
                                                {isVariantDialogOpen && (
                                                    <VariantAddUploadDialog
                                                        open={isVariantDialogOpen}
                                                        onClose={() =>
                                                            setVariantDialogOpen(
                                                                false
                                                            )
                                                        }
                                                        variantIndex={currentVariantIndex}
                                                        storeHandle={storeHandle}
                                                        onVariantImageUpload={handleVariantImageUpload}
                                                        productFolder={getProductFolder() || ''}
                                                    />
                                                )}
                                            </div>
                                            <div className="grid grid-cols-6 gap-4 items-center border-b border-gray-700 py-2">
                                                {/* Hidden Variant ID */}
                                                <addProductForm.Field name={`variants[${index}].id`}>
                                                    {(field) => <input type="hidden" value={field.state.value} />}
                                                </addProductForm.Field>

                                                {/* Variant Title */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].title`}
                                                    validators={{
                                                        onBlur: ({ value }) => {
                                                            if (!value || value.trim().length === 0) {
                                                                return 'Title is required.';
                                                            }
                                                            if (value.trim().length < 1) {
                                                                return 'Title must be at least 1 character long.';
                                                            }
                                                            return undefined;
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>Title</Label>
                                                            <Input
                                                                placeholder="Variant Title"
                                                                value={field.state.value}
                                                                onChange={(e) =>
                                                                    field.handleChange(e.target.value)
                                                                }
                                                                onBlur={field.handleBlur}
                                                            />
                                                            {field.state.meta.errors?.length > 0 && (
                                                                <span className="text-red-500 mt-1 block">
                                                                    {field.state.meta.errors.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant SKU */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].sku`}
                                                    asyncDebounceMs={100}
                                                    validators={{
                                                        onBlur: () => undefined,
                                                        onChangeAsync: async ({ value }) => {
                                                            if (value.trim() === '') return undefined;
                                                            try {
                                                                const response = await validateSku(
                                                                    value.toString(),
                                                                    addProductForm.getFieldValue(`variants[${index}].id`)
                                                                );
                                                                if (response === false) {
                                                                    return 'SKU already exists';
                                                                }
                                                                return undefined;
                                                            } catch (error) {
                                                                console.error('Failed to validate SKU:', error);
                                                                return 'Failed to validate SKU';
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>SKU</Label>
                                                            <Tooltip open={field.state.meta.errors?.length > 0}>
                                                                <TooltipTrigger asChild>
                                                                    <Input
                                                                        placeholder="SKU"
                                                                        value={field.state.value}
                                                                        onChange={(e) =>
                                                                            field.handleChange(e.target.value)
                                                                        }
                                                                        onBlur={field.handleBlur}
                                                                    />
                                                                </TooltipTrigger>
                                                                {field.state.meta.errors?.length > 0 && (
                                                                    <TooltipContent>
                                                                        <span className="text-red-500">
                                                                            {field.state.meta.errors.join(', ')}
                                                                        </span>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant Barcode */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].barcode`}
                                                    asyncDebounceMs={100}
                                                    validators={{
                                                        onBlur: () => undefined,
                                                        onChangeAsync: async ({ value }) => {
                                                            if (value.trim() === '') return undefined;
                                                            try {
                                                                const response = await validateBarcode(
                                                                    value.toString(),
                                                                    addProductForm.getFieldValue(`variants[${index}].id`)
                                                                );
                                                                if (response === false) {
                                                                    return 'Barcode already exists';
                                                                }
                                                                return undefined;
                                                            } catch (error) {
                                                                console.error('Failed to validate Barcode:', error);
                                                                return 'Failed to validate Barcode';
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>Barcode</Label>
                                                            <Tooltip open={field.state.meta.errors?.length > 0}>
                                                                <TooltipTrigger asChild>
                                                                    <Input
                                                                        placeholder="Barcode"
                                                                        value={field.state.value}
                                                                        onChange={(e) =>
                                                                            field.handleChange(e.target.value)
                                                                        }
                                                                        onBlur={field.handleBlur}
                                                                    />
                                                                </TooltipTrigger>
                                                                {field.state.meta.errors?.length > 0 && (
                                                                    <TooltipContent>
                                                                        <span className="text-red-500">
                                                                            {field.state.meta.errors.join(', ')}
                                                                        </span>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant EAN */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].ean`}
                                                    asyncDebounceMs={100}
                                                    validators={{
                                                        onBlur: () => undefined,
                                                        onChangeAsync: async ({ value }) => {
                                                            if (value.trim() === '') return undefined;
                                                            try {
                                                                const response = await validateEan(
                                                                    value.toString(),
                                                                    addProductForm.getFieldValue(`variants[${index}].id`)
                                                                );
                                                                if (response === false) {
                                                                    return 'EAN already exists';
                                                                }
                                                                return undefined;
                                                            } catch (error) {
                                                                console.error('Failed to validate EAN:', error);
                                                                return 'Failed to validate EAN';
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>EAN</Label>
                                                            <Tooltip open={field.state.meta.errors?.length > 0}>
                                                                <TooltipTrigger asChild>
                                                                    <Input
                                                                        placeholder="EAN"
                                                                        value={field.state.value}
                                                                        onChange={(e) =>
                                                                            field.handleChange(e.target.value)
                                                                        }
                                                                        onBlur={field.handleBlur}
                                                                    />
                                                                </TooltipTrigger>
                                                                {field.state.meta.errors?.length > 0 && (
                                                                    <TooltipContent>
                                                                        <span className="text-red-500">
                                                                            {field.state.meta.errors.join(', ')}
                                                                        </span>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant UPC */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].upc`}
                                                    asyncDebounceMs={100}
                                                    validators={{
                                                        onBlur: () => undefined,
                                                        onChangeAsync: async ({ value }) => {
                                                            if (value.trim() === '') return undefined;
                                                            try {
                                                                const response = await validateUpc(
                                                                    value.toString(),
                                                                    addProductForm.getFieldValue(`variants[${index}].id`)
                                                                );
                                                                if (response === false) {
                                                                    return 'UPC already exists';
                                                                }
                                                                return undefined;
                                                            } catch (error) {
                                                                console.error('Failed to validate UPC:', error);
                                                                return 'Failed to validate UPC';
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>UPC</Label>
                                                            <Tooltip open={field.state.meta.errors?.length > 0}>
                                                                <TooltipTrigger asChild>
                                                                    <Input
                                                                        placeholder="UPC"
                                                                        value={field.state.value}
                                                                        onChange={(e) =>
                                                                            field.handleChange(e.target.value)
                                                                        }
                                                                        onBlur={field.handleBlur}
                                                                    />
                                                                </TooltipTrigger>
                                                                {field.state.meta.errors?.length > 0 && (
                                                                    <TooltipContent>
                                                                        <span className="text-red-500">
                                                                            {field.state.meta.errors.join(', ')}
                                                                        </span>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant Quantity */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].inventory_quantity`}
                                                    key={`inventory_quantity-${index}`}
                                                    validators={{
                                                        onBlur: ({ value }) => {
                                                            if (value === undefined) {
                                                                return 'Quantity is required.';
                                                            }
                                                            if (value < 0) {
                                                                return 'Quantity cannot be negative.';
                                                            }
                                                            if (value === 0) {
                                                                return 'Quantity cannot be zero';
                                                            }
                                                            return undefined;
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>Quantity</Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="Quantity"
                                                                value={field.state.value || ''}
                                                                onChange={(e) =>
                                                                    // Wrap the conversion in an updater function:
                                                                    field.handleChange(() => Number(e.target.value))
                                                                }
                                                                onBlur={field.handleBlur}
                                                            />
                                                            {field.state.meta.errors?.length > 0 && (
                                                                <span className="text-red-500 mt-1 block">
                                                                    {field.state.meta.errors.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Variant Price */}
                                                <addProductForm.Field
                                                    name={`variants[${index}].price`}
                                                    key={`price-${index}`}
                                                    validators={{
                                                        onBlur: ({ value }) => {
                                                            const numericValue = Number(value);
                                                            if (value === undefined || isNaN(numericValue)) {
                                                                return 'Price is required and must be a number.';
                                                            }
                                                            if (numericValue < 0) {
                                                                return 'Price cannot be negative.';
                                                            }
                                                            if (numericValue === 0) {
                                                                return 'Price cannot be zero.';
                                                            }
                                                            return undefined;
                                                        },
                                                    }}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>
                                                                Price in{' '}
                                                                {['usdc', 'usdt'].includes(
                                                                    preferredCurrency?.toLowerCase() ?? ''
                                                                )
                                                                    ? 'USD'
                                                                    : preferredCurrency?.toUpperCase() ?? 'ETH'}
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                placeholder="Price"
                                                                value={field.state.value}
                                                                onChange={(e) => field.handleChange(e.target.value)}
                                                                onBlur={field.handleBlur}
                                                            />
                                                            {field.state.meta.errors?.length > 0 && (
                                                                <span className="text-red-500 mt-1 block">
                                                                    {field.state.meta.errors.join(', ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </addProductForm.Field>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 mt-4 border-b border-gray-700 pb-4">
                                                {/* Weight */}
                                                <addProductForm.Field name={`variants[${index}].weight`} key={`weight-${index}`}>
                                                    {(field) => (
                                                        <div>
                                                            <Label className="block text-sm font-medium">
                                                                Weight (g)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={field.state.value}
                                                                onChange={(e) =>
                                                                    field.handleChange(() => Number(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Length */}
                                                <addProductForm.Field name={`variants[${index}].length`} key={`length-${index}`}>
                                                    {(field) => (
                                                        <div>
                                                            <Label className="block text-sm font-medium">
                                                                Length (cm)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={field.state.value}
                                                                onChange={(e) =>
                                                                    field.handleChange(() => Number(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Height */}
                                                <addProductForm.Field name={`variants[${index}].height`} key={`height-${index}`}>
                                                    {(field) => (
                                                        <div>
                                                            <Label className="block text-sm font-medium">
                                                                Height (cm)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={field.state.value}
                                                                onChange={(e) =>
                                                                    field.handleChange(() => Number(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </addProductForm.Field>

                                                {/* Width */}
                                                <addProductForm.Field name={`variants[${index}].width`} key={`width-${index}`}>
                                                    {(field) => (
                                                        <div>
                                                            <Label className="block text-sm font-medium">
                                                                Width (cm)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={field.state.value}
                                                                onChange={(e) =>
                                                                    field.handleChange(() => Number(e.target.value))
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </addProductForm.Field>
                                            </div>

                                            <div className="mt-4">
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleRemoveVariant(index)}
                                                >
                                                    Remove Variant
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>


                                ))}
                            </Accordion>
                        </div>



                        {/* Action Buttons */}
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

                                <addProductForm.Subscribe
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
                                            addProductMutation.mutate(payload);
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
                                </addProductForm.Subscribe>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
