import NotFoundComponent from './pages/NotFoundComponent.tsx';
import {
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router';
import OrdersPage from '@/pages/orders/orders-page.tsx';
import HomePage from '@/pages/home/home-page.tsx';
import RootComponent from '@/pages/RootComponent.tsx';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter'

export const OrderSearchSchema = z.object({
    page: z.coerce.number().catch(0),
    count: z.coerce.number().catch(10),
    filter: z.string().optional(),
    sort: z.string().optional(),
});



// Create the root route
const rootRoute = createRootRoute({
    component: () => (
        <>
            {/* The main layout component */}
            <RootComponent />
        </>
    ),
});

const ordersRoute = createRoute({
    path: '/orders',
    component: OrdersPage,
    getParentRoute: () => rootRoute, // Specify the parent route

    // Use Zod Validator to validate the search parameters
    validateSearch: zodValidator(OrderSearchSchema),
});


// Add additional routes
const homeRoute = createRoute({
    path: '/',
    component: HomePage,
    getParentRoute: () => rootRoute,
});

const notFoundRoute = createRoute({
    path: '*',
    component: NotFoundComponent,
    getParentRoute: () => rootRoute,
});

// Add child routes to the root route
rootRoute.addChildren([homeRoute, ordersRoute, notFoundRoute]);

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
