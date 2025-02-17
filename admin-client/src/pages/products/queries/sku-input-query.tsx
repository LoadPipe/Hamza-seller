// Isolating the SKU input component's `Validation Check` as it will be used in both the product creation and editing forms. @Doom
// SkuInput.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateSku } from '@/pages/products/api/validate-sku';

interface SkuInputProps {
    initialSku: string;
    onChange: (sku: string) => void;
}

export function SkuInputQuery({ initialSku, onChange }: SkuInputProps) {
    const [sku, setSku] = useState(initialSku);

    const { refetch, data, isLoading, error } = useQuery({
        queryKey: ['validate-sku', sku],
        queryFn: () => validateSku(Number(sku)),
        enabled: false,
    });

    const handleBlur = () => {
        if (sku.trim()) {
            refetch();
        }
    };

    return (
        <div>
            <Label>SKU</Label>
            <Input
                placeholder="SKU"
                value={sku}
                onChange={(e) => {
                    setSku(e.target.value);
                    onChange(e.target.value);
                }}
                onBlur={handleBlur}
            />
            {isLoading && <span>Validating SKU...</span>}
            {error && (
                <span className="text-red-500">
                    Invalid SKU: {error.message}
                </span>
            )}
            {data && !error && (
                <span className="text-green-500">SKU is valid!</span>
            )}
        </div>
    );
}
