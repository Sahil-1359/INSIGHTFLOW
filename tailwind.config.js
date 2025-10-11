/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "var(--color-border)", /* white with opacity */
          input: "var(--color-input)", /* slate-800 */
          ring: "var(--color-ring)", /* cyan-500 */
          background: "var(--color-background)", /* slate-900 */
          foreground: "var(--color-foreground)", /* slate-50 */
          primary: {
            DEFAULT: "var(--color-primary)", /* blue-800 */
            foreground: "var(--color-primary-foreground)", /* slate-50 */
          },
          secondary: {
            DEFAULT: "var(--color-secondary)", /* slate-800 */
            foreground: "var(--color-secondary-foreground)", /* slate-50 */
          },
          destructive: {
            DEFAULT: "var(--color-destructive)", /* red-500 */
            foreground: "var(--color-destructive-foreground)", /* slate-50 */
          },
          muted: {
            DEFAULT: "var(--color-muted)", /* slate-700 */
            foreground: "var(--color-muted-foreground)", /* slate-400 */
          },
          accent: {
            DEFAULT: "var(--color-accent)", /* cyan-500 */
            foreground: "var(--color-accent-foreground)", /* slate-900 */
          },
          popover: {
            DEFAULT: "var(--color-popover)", /* slate-800 */
            foreground: "var(--color-popover-foreground)", /* slate-50 */
          },
          card: {
            DEFAULT: "var(--color-card)", /* slate-800 */
            foreground: "var(--color-card-foreground)", /* slate-50 */
          },
          success: {
            DEFAULT: "var(--color-success)", /* emerald-500 */
            foreground: "var(--color-success-foreground)", /* slate-50 */
          },
          warning: {
            DEFAULT: "var(--color-warning)", /* amber-500 */
            foreground: "var(--color-warning-foreground)", /* slate-900 */
          },
          error: {
            DEFAULT: "var(--color-error)", /* red-500 */
            foreground: "var(--color-error-foreground)", /* slate-50 */
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        backdropBlur: {
          xs: '2px',
          sm: '4px',
          md: '12px',
          lg: '16px',
          xl: '24px',
          '2xl': '40px',
          '3xl': '64px',
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fade-in 0.3s ease-out",
          "fade-out": "fade-out 0.3s ease-out",
          "scale-in": "scale-in 0.15s ease-out",
          "scale-out": "scale-out 0.15s ease-out",
          "slide-in": "slide-in 0.3s ease-out",
          "slide-out": "slide-out 0.3s ease-out",
          "shimmer": "shimmer 2s infinite",
          "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "fade-in": {
            from: { opacity: "0" },
            to: { opacity: "1" },
          },
          "fade-out": {
            from: { opacity: "1" },
            to: { opacity: "0" },
          },
          "scale-in": {
            from: { transform: "scale(0.95)", opacity: "0" },
            to: { transform: "scale(1)", opacity: "1" },
          },
          "scale-out": {
            from: { transform: "scale(1)", opacity: "1" },
            to: { transform: "scale(0.95)", opacity: "0" },
          },
          "slide-in": {
            from: { transform: "translateY(-10px)", opacity: "0" },
            to: { transform: "translateY(0)", opacity: "1" },
          },
          "slide-out": {
            from: { transform: "translateY(0)", opacity: "1" },
            to: { transform: "translateY(-10px)", opacity: "0" },
          },
          "shimmer": {
            "0%": { backgroundPosition: "-200% 0" },
            "100%": { backgroundPosition: "200% 0" },
          },
        },
        transitionTimingFunction: {
          'spring': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
        zIndex: {
          '60': '60',
          '70': '70',
          '80': '80',
          '90': '90',
          '100': '100',
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
    ],
  }