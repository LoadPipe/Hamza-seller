// src/pages/OrdersComponent.jsx
import React from 'react';
import FormBase from '../../components/FormBase.tsx';

const OrdersComponent = () => {

    const fields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            defaultValue: '',
            validation: {
                required: 'Name is required',
            },
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            defaultValue: '',
            validation: {
                required: 'Email is required',
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                },
            },
        },
        // Add more fields as needed
    ];

    const handleSubmit = (data) => {
        console.log('Form Data:', data);
        // Handle form submission logic here
    };

    return (
        <div>
            <h1>Orders</h1>
            <p>Welcome to the Orders page!</p>
            <FormBase fields={fields} onSubmit={handleSubmit} />
        </div>
    );
};

export default OrdersComponent;
