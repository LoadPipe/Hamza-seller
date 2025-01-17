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
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectItem,
//     SelectValue,
// } from '@/components/ui/select';
import { formatCryptoPrice } from '@/utils/get-product-price.ts';
import { z } from 'zod';
import { ProductSchema } from '@/pages/products/product-schema.ts';
import { Label } from '@/components/ui/label.tsx';
import { useForm, getBy, setBy } from '@tanstack/react-form';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth.ts';
import { useToast } from '@/hooks/use-toast.ts';

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
        (state) => state.preferred_currency_code
    );
    const { toast } = useToast();

    const { data, isLoading, error } = useQuery<FetchProductResponse, Error>({
        queryKey: ['view-product-form', productId],
        queryFn: () => fetchProductById(productId),
    });

    const updateEditForm = useMutation({
        mutationFn: async (payload: any) => {
            if (!payload || Object.keys(payload).length === 0) {
                console.log('Empty payload; skipping mutation.');
                throw new Error('No changes detected to update.');
            }
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
                title: variant.title || '',
                sku: variant.sku || '',
                weight: variant.weight || 0,
                length: variant.length || 0,
                height: variant.height || 0,
                width: variant.width || 0,
                price: parseInt(
                    variant.prices?.find(
                        (p) => p.currency_code === preferredCurrency
                    )?.amount || '0',
                    10
                ),
                quantity: variant.inventory_quantity || 0, // If you want to track quantity
            })),
        },
        // validators: (values) => {
        //     const result = ProductSchema.safeParse(values);
        //     return result.success ? {} : result.error.format();
        // },
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading product data</div>;

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
                        editProductForm.handleSubmit();
                    }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Left side fields */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">
                                General Information
                            </h2>

                            <editProductForm.Field name="title">
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
                            </editProductForm.Field>

                            <editProductForm.Field name="subtitle">
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
                            </editProductForm.Field>

                            <editProductForm.Field name="description">
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
                            </editProductForm.Field>
                        </div>

                        {/* Right side fields */}
                        <div>
                            <h2 className="text-lg font-medium mb-4">
                                Product Media
                            </h2>
                            <editProductForm.Field name="thumbnail">
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
                            </editProductForm.Field>
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

                    {/* Preferred Currency && Base Price */}
                    <div>
                        <div className="mb-4">
                            Preferred Currency:{' '}
                            {preferredCurrency?.toUpperCase() ?? 'ETH'}
                        </div>
                        <div>
                            <editProductForm.Field name="basePrice">
                                {(field) => (
                                    <>
                                        <Label>
                                            Base Price in{' '}
                                            {preferredCurrency.toUpperCase() ??
                                                'ETH'}
                                        </Label>
                                        <Input
                                            className="w-1/2"
                                            placeholder="basePrice"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </editProductForm.Field>
                        </div>
                    </div>

                    {/* Base Product Dimensions */}
                    <div className="grid grid-cols-4 gap-2 my-8">
                        {[
                            { name: 'weight', label: 'Weight (g)' },
                            { name: 'length', label: 'Length (cm)' },
                            { name: 'height', label: 'Height (cm)' },
                            { name: 'width', label: 'Width (cm)' },
                        ].map(({ name, label }) => (
                            <editProductForm.Field key={name} name={name}>
                                {(field) => (
                                    <div className="space-y-1">
                                        <Label className="block text-sm font-medium">
                                            {label}
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder={label}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="block w-full"
                                        />
                                    </div>
                                )}
                            </editProductForm.Field>
                        ))}
                    </div>

                    {/* Variants */}
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
                                                {/* Variant Title */}
                                                <editProductForm.Field
                                                    name={`variants[${index}].title`}
                                                    key={`title-${variant}`}
                                                >
                                                    {(field) => (
                                                        <div>
                                                            <Label>Title</Label>
                                                            <Input
                                                                placeholder="Variant Title"
                                                                value={
                                                                    field.state
                                                                        .value
                                                                }
                                                                onChange={(e) =>
                                                                    field.handleChange(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            {field.state.meta
                                                                .errors
                                                                ?.length >
                                                                0 && (
                                                                <span className="text-red-500">
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
                                                            <Label>SKU</Label>
                                                            <Input
                                                                placeholder="SKU"
                                                                value={
                                                                    field.state
                                                                        .value ||
                                                                    variant.sku ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    field.handleChange(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </editProductForm.Field>

                                                {/* Quantity */}
                                                <editProductForm.Field
                                                    name={`variants[${index}].quantity`}
                                                    key={`quantity-${variant.id}`}
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
                                                                    field.state
                                                                        .value ||
                                                                    variant.inventory_quantity ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
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
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {[
                                                    'weight',
                                                    'length',
                                                    'height',
                                                    'width',
                                                ].map((key) => (
                                                    <editProductForm.Field
                                                        name={`variants[${index}].${key}`}
                                                        key={`${key}-${variant.id}`}
                                                    >
                                                        {(field) => (
                                                            <div>
                                                                <Label>
                                                                    {key
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        key.slice(
                                                                            1
                                                                        )}
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    placeholder={
                                                                        key
                                                                    }
                                                                    value={
                                                                        field
                                                                            .state
                                                                            .value ||
                                                                        variant[
                                                                            key
                                                                        ] ||
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
                                                                />
                                                            </div>
                                                        )}
                                                    </editProductForm.Field>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}

                    <div className="flex justify-end mt-8">
                        <editProductForm.Subscribe
                            selector={(formState) => {
                                let dirtyFields: Record<string, unknown> = {};

                                // Iterate through fieldMeta to check for dirty (modified) fields
                                for (const [
                                    fieldName,
                                    fieldMeta,
                                ] of Object.entries(formState.fieldMeta)) {
                                    if (fieldMeta.isDirty) {
                                        const currentValue = getBy(
                                            formState.values,
                                            fieldName
                                        );

                                        dirtyFields = setBy(
                                            dirtyFields,
                                            fieldName,
                                            currentValue
                                        );
                                        console.log(
                                            'fieldMeta:',
                                            fieldName,
                                            fieldMeta
                                        );
                                    }
                                    console.log(
                                        'fieldMeta:',
                                        fieldName,
                                        fieldMeta
                                    );
                                    // if (fieldMeta.isDirty) {
                                    //     dirtyFields[fieldName] =
                                    //         formState.values[fieldName];
                                    // }
                                }

                                return {
                                    dirtyFields, // Return dirty fields separately
                                    canSubmit: formState.canSubmit,
                                    isSubmitting: formState.isSubmitting,
                                };
                            }}
                        >
                            {({ dirtyFields, canSubmit, isSubmitting }) => {
                                const handleSubmit = async () => {
                                    if (Object.keys(dirtyFields).length === 0) {
                                        toast({
                                            variant: 'default',
                                            title: 'No Changes!',
                                            description: 'No Changes to submit',
                                        });
                                        return;
                                    }

                                    console.log(
                                        'Dirty Fields only:',
                                        dirtyFields
                                    );

                                    // Ensure payload structure
                                    const payload = {
                                        ...dirtyFields, // Flatten dirty fields into the payload
                                    };

                                    updateEditForm.mutate(payload); // Send structured payload
                                };

                                return (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit || isSubmitting}
                                    >
                                        Save Changes
                                    </Button>
                                );
                            }}
                        </editProductForm.Subscribe>
                    </div>
                </form>
            </div>
        </div>
    );
}
