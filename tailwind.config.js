import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#4f46e5",
                "primary-container": "#eef2ff",
                "primary-fixed": "#e0e7ff",
                "primary-fixed-dim": "#c7d2fe",
                "on-primary": "#ffffff",
                "on-primary-container": "#3730a3",
                "on-primary-fixed": "#312e81",
                "on-primary-fixed-variant": "#4338ca",
                "inverse-primary": "#818cf8",
                "secondary": "#059669",
                "secondary-container": "#d1fae5",
                "secondary-fixed": "#a7f3d0",
                "secondary-fixed-dim": "#6ee7b7",
                "on-secondary": "#ffffff",
                "on-secondary-container": "#065f46",
                "on-secondary-fixed": "#064e3b",
                "on-secondary-fixed-variant": "#047857",
                "tertiary": "#d97706",
                "tertiary-container": "#fef3c7",
                "tertiary-fixed": "#fde68a",
                "tertiary-fixed-dim": "#fcd34d",
                "on-tertiary": "#ffffff",
                "on-tertiary-container": "#92400e",
                "on-tertiary-fixed": "#78350f",
                "on-tertiary-fixed-variant": "#b45309",
                "background": "#f9fafb",
                "on-background": "#1f2937",
                "surface": "#ffffff",
                "on-surface": "#1f2937",
                "surface-dim": "#f3f4f6",
                "surface-bright": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f3f4f6",
                "surface-container": "#f9fafb",
                "surface-container-high": "#f3f4f6",
                "surface-container-highest": "#e5e7eb",
                "surface-variant": "#f3f4f6",
                "on-surface-variant": "#6b7280",
                "inverse-surface": "#1f2937",
                "inverse-on-surface": "#f3f4f6",
                "outline": "#6b7280",
                "outline-variant": "#e5e7eb",
                "error": "#ef4444",
                "error-container": "#fee2e2",
                "on-error": "#ffffff",
                "on-error-container": "#991b1b",
                "surface-tint": "#4f46e5"
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            spacing: {
                "margin-mobile": "16px",
                "container-max": "1280px",
                "stack-unit": "8px",
                "gutter": "24px",
                "margin-desktop": "40px"
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                "body-lg": ["Figtree"],
                "label-md": ["Figtree"],
                "headline-xl": ["Figtree"],
                "headline-md": ["Figtree"],
                "headline-lg-mobile": ["Figtree"],
                "headline-lg": ["Figtree"],
                "body-md": ["Figtree"],
                "label-sm": ["Figtree"]
            },
            fontSize: {
                "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500"}],
                "headline-xl": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "600"}]
            }
        },
    },

    plugins: [forms],
};
