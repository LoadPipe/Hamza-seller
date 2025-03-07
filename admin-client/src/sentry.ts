// src/sentry.ts
import * as Sentry from '@sentry/react';
import {router} from "@/routes.tsx";
const SENTRY_DNS = import.meta.env.VITE_SENTRY_DNS;

Sentry.init({
    dsn: SENTRY_DNS,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    // Adjust the tracesSampleRate in production as necessary
    tracesSampleRate: 1.0,
});

