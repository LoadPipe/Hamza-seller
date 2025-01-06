import NotFoundComponent from './pages/NotFoundComponent.tsx';
import {
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router';
import OrdersPage from '@/pages/orders/orders-page.tsx';
import ProductsPage from '@/pages/products/products-page.tsx';
import RootComponent from '@/pages/RootComponent.tsx';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';
import HomePage from './pages/home/home-page.tsx';
import AddProductPage from '@/pages/products/add-product-page.tsx';
import EditProductPage from '@/pages/products/edit-product-page.tsx';
import ProductCategoryPage from '@/pages/products/product-category-page.tsx';
import DashboardPage from '@/pages/dashboard/dashboard-page.tsx';
import SettingsPage from '@/pages/settings/settings-page.tsx';
import AnalyticsPage from '@/pages/analytics/analytics-page.tsx';

export const OrderSearchSchema = z.object({
    page: z.coerce.number().catch(0),
    count: z.coerce.number().catch(10),
    filter: z.string().optional(),
    sort: z.string().optional(),
});

export const ProductSearchSchema = z.object({
    page: z.coerce.number().catch(0),
    count: z.coerce.number().catch(10),
    filter: z.string().optional(),
    sort: z.string().optional(),
});

// Create the root route
const rootRoute = createRootRoute({
    component: () => (
        <>
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

const productsRoute = createRoute({
    path: '/products',
    component: ProductsPage,
    getParentRoute: () => rootRoute, // Specify the parent route

    // Use Zod Validator to validate the search parameters
    validateSearch: zodValidator(ProductSearchSchema),
});

const addProductRoute = createRoute({
    path: '/add-product',
    component: AddProductPage,
    getParentRoute: () => rootRoute, // Specify the parent route
});

const editProductRoute = createRoute({
    path: '/edit-product',
    component: EditProductPage,
    getParentRoute: () => rootRoute, // Specify the parent route
});

const productCategory = createRoute({
    path: 'product-category',
    component: ProductCategoryPage,
    getParentRoute: () => rootRoute, // Specify the parent route
});

const homeRoute = createRoute({
    path: '/',
    component: HomePage,
    getParentRoute: () => rootRoute,
});

const DashboardRoute = createRoute({
    path: 'dashboard',
    component: DashboardPage,
    getParentRoute: () => rootRoute,
});

const analyticsRoute = createRoute({
    path: 'analytics',
    component: AnalyticsPage,
    getParentRoute: () => rootRoute,
});

const settingsRoute = createRoute({
    path: 'settings',
    component: SettingsPage,
    getParentRoute: () => rootRoute,
});

const notFoundRoute = createRoute({
    path: '*',
    component: NotFoundComponent,
    getParentRoute: () => rootRoute,
});

// Add child routes to the root route
rootRoute.addChildren([
    homeRoute,
    DashboardRoute,
    ordersRoute,
    productsRoute,
    addProductRoute,
    editProductRoute,
    productCategory,
    analyticsRoute,
    settingsRoute,
    notFoundRoute,
]);

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
