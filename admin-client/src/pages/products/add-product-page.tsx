import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { AddProductSchema } from '@/pages/products/product-schema.ts';
import { GripVertical } from 'lucide-react';
import { VariantsTable } from '@/pages/products/variants-table.tsx';

type AddProductFormValues = {
    title: string;
    subtitle: string;
    handle: string;
    description: string;
    weight: number;
    length: number;
    height: number;
    width: number;
    basePrice: string;
    discountPercentage: string;
    discountType: 'flat' | 'percentage';
    sku: string;
    barcode: string;
    quantity: string;
    attributes: Attribute[];
    variants: any[];
    status: 'active' | 'draft' | 'archived';
    productImages: string[];
    productCategory: string;
    productTags: string;
};

type Attribute = {
    name: string;
    values: string[];
};

function generateVariants(attributes: Attribute[]): string[][] {
    if (!attributes.length) return [];

    const arraysOfValues = attributes.map((attr) => attr.values);

    const cartesianProduct = (...arrs: string[][]): string[][] =>
        arrs.reduce(
            (acc, curr) =>
                acc.flatMap((combo) => curr.map((value) => [...combo, value])),
            [[]] as string[][]
        );

    return cartesianProduct(...arraysOfValues);
}

export default function AddProductPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'attributes' | 'variants'>(
        'attributes'
    );
    const [newAttributeName, setNewAttributeName] = useState('');
    const [newAttributeValues, setNewAttributeValues] = useState('');

    const addProductForm = useForm<AddProductFormValues>({
        defaultValues: {
            title: '',
            subtitle: '',
            handle: '',
            description: '',
            weight: 0,
            length: 0,
            height: 0,
            width: 0,
            basePrice: '',
            discountPercentage: '',
            discountType: 'flat',
            sku: '',
            barcode: '',
            quantity: '',
            attributes: [],
            variants: [],
            status: 'active',
            productImages: [],
            productCategory: '',
            productTags: '',
        },
        validators: (values) => {
            const result = AddProductSchema.safeParse(values);
            return result.success ? {} : result.error.format();
        },
    });

    const existingAttributes = addProductForm.getFieldValue('attributes') || [];

    // For testing. Can be removed later after integrating the API.
    function handleAddAttribute() {
        if (!newAttributeName.trim()) return;

        const valuesArray = newAttributeValues
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean);

        const currentAttributes =
            addProductForm.getFieldValue('attributes') ?? [];

        const attributeIndex = currentAttributes.findIndex(
            (attr: Attribute) =>
                attr.name.toLowerCase() ===
                newAttributeName.trim().toLowerCase()
        );

        if (attributeIndex !== -1) {
            const updatedAttributes = [...currentAttributes];
            updatedAttributes[attributeIndex] = {
                name: newAttributeName.trim(),
                values: valuesArray,
            };
            addProductForm.setFieldValue('attributes', updatedAttributes);
        } else {
            addProductForm.setFieldValue('attributes', [
                ...currentAttributes,
                { name: newAttributeName.trim(), values: valuesArray },
            ]);
        }

        setNewAttributeName('');
        setNewAttributeValues('');
    }

    function handleSelectExisting(selectedName: string) {
        const foundAttr = existingAttributes.find(
            (a: Attribute) => a.name === selectedName
        );
        if (foundAttr) {
            setNewAttributeName(foundAttr.name);
            setNewAttributeValues(foundAttr.values.join(', '));
        }
    }

    const createProduct = useMutation({
        mutationFn: async (payload: any) => {
            //TODO
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                variant: 'default',
                title: 'Success!',
                description: 'Product created successfully.',
            });
            navigate({ to: '/products' });
        },
        onError: (err: unknown) => {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create product.',
            });
            console.error('Error creating product:', err);
        },
    });

    const handleSubmitForm = () => {
        // const payload = addProductForm.getValues();
        // createProduct.mutate(payload);
    };

    // For testing. Can be removed later after integrating the API.
    useEffect(() => {
        const attributes = addProductForm.getFieldValue('attributes') || [];
        const combos = generateVariants(attributes);
        const newVariants = combos.map((combo) => ({
            combination: combo,
            selected: false,
        }));

        addProductForm.setFieldValue('variants', newVariants);
    }, [addProductForm, newAttributeName]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar / Header */}
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Add New Product</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => navigate({ to: '/products' })}
                    >
                        Discard Changes
                    </Button>
                    <Button onClick={handleSubmitForm}>Add Product</Button>
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addProductForm.handleSubmit();
                }}
            >
                <div className="max-w-7xl mx-auto px-8 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                        {/* LEFT COLUMN */}
                        <div className="flex flex-col gap-6">
                            {/* General Information */}
                            <div className="bg-[var(--90-black,#121212)] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    General Information
                                </h2>

                                <addProductForm.Field name="title">
                                    {(field) => (
                                        <>
                                            <Label className="text-lg font-semibold tracking-normal">
                                                Product Name
                                            </Label>
                                            <Input
                                                placeholder="e.g. Short Sleeve T-Shirt"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="mt-4 mb-4 bg-[#040404]"
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
                                </addProductForm.Field>

                                <addProductForm.Field name="subtitle">
                                    {(field) => (
                                        <>
                                            <Label className="text-lg font-semibold tracking-normal">
                                                Subtitle
                                            </Label>
                                            <Input
                                                placeholder="e.g. Comfortable, stylish, and perfect for any occasion"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="mt-4 mb-4 bg-[#040404]"
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
                                </addProductForm.Field>

                                <addProductForm.Field name="handle">
                                    {(field) => (
                                        <>
                                            <Label className="text-lg font-semibold tracking-normal">
                                                Handle
                                            </Label>
                                            <Input
                                                placeholder="e.g. short-sleeve-t-shirt"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="mt-4 mb-4 bg-[#040404]"
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
                                </addProductForm.Field>

                                <addProductForm.Field name="description">
                                    {(field) => (
                                        <>
                                            <Label className="text-lg font-semibold tracking-normal">
                                                Description
                                            </Label>
                                            <Textarea
                                                placeholder="Provide a brief description of your product. (Max 300 characters)"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="mt-4 mb-4 bg-[#040404]"
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
                                </addProductForm.Field>
                            </div>

                            {/* Pricing */}
                            <div className="bg-[var(--90-black,#121212)] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    Pricing
                                </h2>

                                <addProductForm.Field name="basePrice">
                                    {(field) => (
                                        <div className="flex flex-col mb-4">
                                            <Label className="text-lg font-semibold tracking-normal">
                                                Base Price
                                            </Label>
                                            <Input
                                                type="number"
                                                placeholder="Enter Price"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                className="bg-[#040404] border border-[#333] rounded-md mt-4 mb-4"
                                            />
                                            {field.state.meta.errors?.length >
                                                0 && (
                                                <span className="text-red-500 text-sm mt-1">
                                                    {field.state.meta.errors.join(
                                                        ', '
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </addProductForm.Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <addProductForm.Field name="discountPercentage">
                                        {(field) => (
                                            <div className="flex flex-col">
                                                <Label className="text-lg font-semibold tracking-normal">
                                                    Discount Percentage (%)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    placeholder="Ex. 25%"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    className="bg-[#040404] border border-[#333] rounded-md mt-4 mb-4"
                                                />
                                                {field.state.meta.errors
                                                    ?.length > 0 && (
                                                    <span className="text-red-500 text-sm mt-1">
                                                        {field.state.meta.errors.join(
                                                            ', '
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </addProductForm.Field>

                                    <addProductForm.Field name="discountType">
                                        {(field) => (
                                            <div className="flex flex-col">
                                                <Label className="text-lg font-semibold tracking-normal">
                                                    Discount Type
                                                </Label>
                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(val) =>
                                                        field.handleChange(val)
                                                    }
                                                >
                                                    <SelectTrigger className=" bg-[#040404] rounded-lg text-white border border-[#333] px-4 mt-4 mb-4">
                                                        <SelectValue placeholder="Select a discount type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="flat">
                                                            Flat
                                                        </SelectItem>
                                                        <SelectItem value="percentage">
                                                            Percentage
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </addProductForm.Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <addProductForm.Field name="sku">
                                        {(field) => (
                                            <div className="flex flex-col">
                                                <Label className="text-lg font-semibold tracking-normal">
                                                    SKU
                                                </Label>
                                                <Input
                                                    placeholder="Ex. UY3897"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-[#040404] border border-[#333] rounded-md mt-4 mb-4"
                                                />
                                            </div>
                                        )}
                                    </addProductForm.Field>

                                    <addProductForm.Field name="barcode">
                                        {(field) => (
                                            <div className="flex flex-col">
                                                <Label className="text-lg font-semibold tracking-normal">
                                                    Barcode
                                                </Label>
                                                <Input
                                                    placeholder="Ex. 189674421"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-[#040404] border border-[#333] rounded-md mt-4 mb-4"
                                                />
                                            </div>
                                        )}
                                    </addProductForm.Field>

                                    <addProductForm.Field name="quantity">
                                        {(field) => (
                                            <div className="flex flex-col">
                                                <Label className="text-lg font-semibold tracking-normal">
                                                    Quantity
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter quantity"
                                                    value={field.state.value}
                                                    onChange={(e) =>
                                                        field.handleChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="bg-[#040404] border border-[#333] rounded-md mt-4 mb-4"
                                                />
                                            </div>
                                        )}
                                    </addProductForm.Field>
                                </div>
                            </div>

                            {/* Product Data (Tabs) */}
                            <div className="bg-[var(--90-black,#121212)] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    Product Data
                                </h2>
                                <div className="flex mb-6 relative rounded-xl w-full h-11">
                                    <button
                                        className={`flex-1 items-center justify-center font-semibold text-lg transition-all ${
                                            activeTab === 'attributes'
                                                ? 'bg-[#A3EB64] text-black rounded-xl'
                                                : 'text-gray-400'
                                        }`}
                                        onClick={() =>
                                            setActiveTab('attributes')
                                        }
                                        type="button"
                                    >
                                        Attributes
                                    </button>
                                    <button
                                        className={`flex-1 items-center justify-center font-semibold text-lg transition-all ${
                                            activeTab === 'variants'
                                                ? 'bg-[#A3EB64] text-black rounded-xl'
                                                : 'text-gray-400'
                                        }`}
                                        onClick={() => setActiveTab('variants')}
                                        type="button"
                                    >
                                        Variants
                                    </button>
                                </div>

                                {activeTab === 'attributes' && (
                                    <div>
                                        <div className="flex gap-4 items-center mb-8">
                                            <Button
                                                className="bg-[#A3EB64] text-black font-semibold w-2/6 h-11"
                                                type="button"
                                                onClick={handleAddAttribute}
                                            >
                                                Add New
                                            </Button>

                                            <Select
                                                onValueChange={(value) =>
                                                    handleSelectExisting(value)
                                                }
                                            >
                                                <SelectTrigger className="rounded-lg bg-[#040404] text-white border border-[#333] px-4 h-11 py-2">
                                                    <SelectValue placeholder="Add existing" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {existingAttributes.map(
                                                        (attr: Attribute) => (
                                                            <SelectItem
                                                                key={attr.name}
                                                                value={
                                                                    attr.name
                                                                }
                                                            >
                                                                {attr.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="bg-[#040404] p-4 rounded-lg">
                                            <h3 className="text-2xl font-semibold tracking-normal mb-5">
                                                New Attribute
                                            </h3>
                                            <label className="text-lg font-semibold tracking-normal">
                                                Attribute Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-[#121212] text-white p-2 rounded-md mt-4 mb-4"
                                                placeholder="Ex. color, size"
                                                value={newAttributeName}
                                                onChange={(e) =>
                                                    setNewAttributeName(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <label className="text-lg font-semibold tracking-normal">
                                                Attribute Value
                                            </label>
                                            <textarea
                                                className="w-full bg-[#121212] text-white p-2 rounded-md mt-4 mb-4"
                                                placeholder="Enter options, e.g. 'Red,Green,Blue' or 'Small,Medium,Large'"
                                                value={newAttributeValues}
                                                onChange={(e) =>
                                                    setNewAttributeValues(
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <Button
                                                className="bg-[#A3EB64] text-black font-semibold"
                                                onClick={handleAddAttribute}
                                            >
                                                Save Attribute
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                            <Button
                                                variant="outline"
                                                className="border border-[#A3EB64] text-[#A3EB64]"
                                                type="button"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[#A3EB64] text-black font-semibold"
                                                type="button"
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'variants' && (
                                    <div className="bg-[#121212] p-6 rounded-lg">
                                        {addProductForm.getFieldValue(
                                            'attributes'
                                        )?.length === 0 ? (
                                            <p className="text-gray-400 mb-4">
                                                No attributes yet. Once
                                                attributes are defined, you can
                                                generate or list variants here.
                                            </p>
                                        ) : (
                                            <div className="overflow-hidden rounded-md">
                                                {addProductForm
                                                    .getFieldValue('attributes')
                                                    ?.map((attr, index) => (
                                                        <div key={attr.name}>
                                                            {/* Attribute row */}
                                                            <div
                                                                className={[
                                                                    'flex items-center justify-between bg-[#040404] px-4 py-3',
                                                                    index === 0
                                                                        ? 'rounded-t-md'
                                                                        : '',
                                                                ].join(' ')}
                                                            >
                                                                {/* Left side: drag handle + attribute name + tags */}
                                                                <div className="flex items-center gap-3">
                                                                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                                                    <div className="flex flex-col">
                                                                        <span className="text-white font-semibold text-[16px] tracking-normal">
                                                                            {
                                                                                attr.name
                                                                            }
                                                                        </span>

                                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                                            {attr.values.map(
                                                                                (
                                                                                    value
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            value
                                                                                        }
                                                                                        className="px-2 py-1 font-normal text-[16px] tracking-normal text-white  bg-[#333] rounded-md"
                                                                                    >
                                                                                        {
                                                                                            value
                                                                                        }
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    variant="outline"
                                                                    className="h-11 rounded-lg px-4 bg-[#272727] text-white"
                                                                    type="button"
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>

                                                            <div className="h-px bg-[#333]" />
                                                        </div>
                                                    ))}

                                                <div className="bg-[#040404] p-4 rounded-b-md">
                                                    <Button
                                                        className="bg-[#272727] text-white font-semibold text-base leading-none px-4 py-2 rounded-md"
                                                        type="button"
                                                    >
                                                        + Add another attribute
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Variants table (bottom section) */}
                                        <div className="mt-6">
                                            <VariantsTable
                                                addProductForm={addProductForm}
                                            />
                                        </div>

                                        {/* Footer buttons */}
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="border border-gray-500 text-gray-300"
                                                type="button"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-[#A3EB64] text-black font-semibold"
                                                type="button"
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col gap-6">
                            {/* Status */}
                            <div className="bg-[#121212] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    Status
                                </h2>
                                <addProductForm.Field name="status">
                                    {(field) => (
                                        <div className="flex flex-col">
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) =>
                                                    field.handleChange(val)
                                                }
                                            >
                                                <SelectTrigger className="bg-[#080808] rounded-lg text-white border border-[#333] px-4">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="draft">
                                                        Draft
                                                    </SelectItem>
                                                    <SelectItem value="archived">
                                                        Archived
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </addProductForm.Field>
                            </div>

                            {/* Product Media */}
                            <div className="bg-[#121212] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    Product Media
                                </h2>
                                <Label className="text-lg font-semibold tracking-normal">
                                    Images
                                </Label>
                                <div>
                                    <div className="border border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center mt-4 mb-4 h-44">
                                        <p className="text-sm text-[#94D42A] font-semibold">
                                            Drag and drop or click to upload
                                        </p>
                                        <p className="text-xs text-gray-400 text-center">
                                            You can upload multiple medias in
                                            PDF, JPG, JPEG, PNG, GIF, MP4 less
                                            than 5MB.
                                        </p>
                                    </div>
                                </div>
                                <Label className="text-lg font-semibold tracking-normal">
                                    Thumbnail URL
                                </Label>
                                <div>
                                    <div className="border border-gray-500 rounded-xl p-6 flex flex-col items-center justify-center mt-5 h-44">
                                        <p className="text-sm text-[#94D42A] font-semibold">
                                            Drag and drop or click to upload
                                        </p>
                                        <p className="text-xs text-gray-400 text-center">
                                            Supported formats: JPG, PNG, GIF |
                                            Max size: 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="bg-[#121212] p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-semibold tracking-normal mb-5">
                                    Category
                                </h2>

                                {/* Product Category */}
                                <addProductForm.Field name="productCategory">
                                    {(field) => (
                                        <div className="flex flex-col mb-4">
                                            <Label className="text-lg font-semibold tracking-normal mb-5">
                                                Product Category
                                            </Label>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) =>
                                                    field.handleChange(val)
                                                }
                                            >
                                                <SelectTrigger className="bg-[#080808] rounded-lg text-white border border-[#333] px-4">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="electronics">
                                                        Electronics
                                                    </SelectItem>
                                                    <SelectItem value="clothing">
                                                        Clothing
                                                    </SelectItem>
                                                    <SelectItem value="accessories">
                                                        Accessories
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </addProductForm.Field>

                                {/* Product Tags */}
                                <addProductForm.Field name="productTags">
                                    {(field) => (
                                        <div className="flex flex-col">
                                            <Label className="text-lg font-semibold tracking-normal mb-5">
                                                Product Tags
                                            </Label>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) =>
                                                    field.handleChange(val)
                                                }
                                            >
                                                <SelectTrigger className="bg-[#080808] rounded-lg text-white border border-[#333] px-4 ">
                                                    <SelectValue placeholder="Select tags" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="laptops">
                                                        Laptops
                                                    </SelectItem>
                                                    <SelectItem value="smartphones">
                                                        Smartphones
                                                    </SelectItem>
                                                    <SelectItem value="tshirts">
                                                        T-Shirts
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </addProductForm.Field>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
