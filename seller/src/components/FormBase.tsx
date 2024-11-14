// import React from 'react';
// import { useForm } from '@tanstack/react-form';

// Define the type for a single form field
// interface Field {
//     name: string;
//     label: string;
//     type?: string;
//     defaultValue?: string;
//     validation?: object; // You can make this more specific if needed
// }

// Define the props type for the FormBase component
// interface FormBaseProps {
//     fields: Field[];
//     onSubmit: (data: Record<string, string>) => void;
// }

// const FormBase: React.FC<FormBaseProps> = ({ fields, onSubmit }) => {
    // const { handleSubmit, register, formState: { errors } } = useForm<Record<string, string>>({
    //     defaultValues: fields.reduce((acc, field) => {
    //         acc[field.name] = field.defaultValue || '';
    //         return acc;
    //     }, {} as Record<string, string>),
    // });
    //
    // return (
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //         {fields.map((field) => (
    //             <div key={field.name}>
    //                 <label htmlFor={field.name}>{field.label}</label>
    //                 <input
    //                     id={field.name}
    //                     {...register(field.name)}
    //                     type={field.type || 'text'}
    //                 />
    //                 {errors[field.name] && <p>{(errors[field.name] as any).message}</p>}
    //             </div>
    //         ))}
    //         <button type="submit">Submit</button>
    //     </form>
    // );
// };
//
// export default FormBase;
