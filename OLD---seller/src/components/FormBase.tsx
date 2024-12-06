import { forwardRef, useImperativeHandle } from 'react';
import { FieldApi, useForm } from '@tanstack/react-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
    return (
        <>
            {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                    <em style={{ color: 'red' }}>
                        {field.state.meta.errors.join(', ')}
                    </em>
                )}
        </>
    );
}

interface Field {
    name: string;
    label: string;
    type?: 'text' | 'checkbox' | 'number' | 'email'; // Add more types as needed
    defaultValue?: string | boolean;
    validators?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange?: (context: { value: any }) => string | undefined;
        onChangeAsync?: (context: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: any;
        }) => Promise<string | undefined>;
    };
}

// Define the props type for the FormBase component
interface FormBaseProps {
    fields: Field[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: Record<string, any>) => void;
}

const FormBase = forwardRef(({ fields, onSubmit }: FormBaseProps, ref) => {
    const form = useForm({
        defaultValues: fields.reduce(
            (acc, field) => {
                acc[field.name] = field.defaultValue ?? '';
                return acc;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {} as Record<string, any>
        ),
        onSubmit: async ({ value }) => {
            onSubmit(value);
        },
    });

    // Expose the `submit` method to the parent component
    useImperativeHandle(ref, () => ({
        submit: () => {
            form.handleSubmit();
        },
    }));

    return (
        <form
            onSubmit={(e) => {
                // console.log('fff', form.state);
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            {fields.map((field) => (
                <div key={field.name}>
                    <form.Field
                        name={field.name}
                        validators={field.validators}
                        children={(fieldApi) => {
                            const inputType = field.type || 'text';

                            return (
                                <>
                                    <label htmlFor={fieldApi.name}>
                                        {field.label}:
                                    </label>
                                    {inputType === 'checkbox' ? (
                                        <input
                                            type="checkbox"
                                            id={fieldApi.name}
                                            checked={!!fieldApi.state.value}
                                            onChange={(e) =>
                                                fieldApi.handleChange(
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    ) : (
                                        <input
                                            type={inputType}
                                            id={fieldApi.name}
                                            value={fieldApi.state.value}
                                            onBlur={fieldApi.handleBlur}
                                            onChange={(e) =>
                                                fieldApi.handleChange(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )}
                                    <FieldInfo field={fieldApi} />
                                </>
                            );
                        }}
                    />
                </div>
            ))}
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                children={([isSubmitting]) => (
                    <button type="submit">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                )}
            />
        </form>
    );
});

export default FormBase;
