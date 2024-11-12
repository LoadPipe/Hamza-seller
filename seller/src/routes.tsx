import NotFoundComponent from './pages/NotFoundComponent.tsx';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import OrdersPage from '@/pages/orders/orders-page.tsx';
import HomePage from '@/pages/home/home-page.tsx';
import RootComponent from '@/pages/RootComponent.tsx';

const routes = [{
    path: '/',
    component: HomePage,
},
{
    path: '/orders',
    component: OrdersPage,

},
{
    path: '*',
    component: NotFoundComponent,
},

];

// Create the root route
const rootRoute = createRootRoute({
    component: () => (
        <>
            {/* The main layout component */}
            <RootComponent />
            <TanStackRouterDevtools initialIsOpen={false} />
        </>
    ),
});

// Add child routes to the root route
rootRoute.addChildren(routes.map(route => {
    return createRoute({
        ...route,
        getParentRoute: () => rootRoute, // Specify the parent route
    });
}));

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
