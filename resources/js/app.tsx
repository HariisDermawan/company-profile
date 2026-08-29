import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

import { AuthProvider } from '@/contexts/AuthContext';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    setup({ el, App, props }) {
        if (!el) {
            throw new Error('Root element not found. Make sure there is a <div id="app"></div> in your Blade layout.');
        }

        const root = createRoot(el);

        root.render(
            <AuthProvider>
                <App {...props} />
            </AuthProvider>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});