import OrdersComponent from './pages/orders/OrdersComponent.tsx';
import NotFoundComponent from './pages/NotFoundComponent.tsx';
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import RootComponent from './pages/RootComponent.tsx';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const routes= [{
    path: '/',
    component: OrdersComponent,
},{
    path: '*',
    component: NotFoundComponent,
},
    {
        path: '/orders'
    }

]

// Create the root route
const rootRoute = createRootRoute({
    component: () => (
        <>
            {/* The main layout component */}
            <OrdersComponent/>
            <TanStackRouterDevtools initialIsOpen={false} />
        </>
    ),
});

// Add child routes to the root route
rootRoute.addChildren(routes.map(route => {
    return createRoute({
        ...route,
        getParentRoute: () => rootRoute, // Specify the parent route
    })
}));

// Create the router
export const router = createRouter({
    routeTree: rootRoute,
});
