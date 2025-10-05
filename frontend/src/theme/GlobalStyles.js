import { createGlobalStyle } from 'styled-components';
import { theme } from './index';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-50: ${theme.colors.primary[50]};
    --primary-100: ${theme.colors.primary[100]};
    --primary-500: ${theme.colors.primary[500]};
    --primary-600: ${theme.colors.primary[600]};
    --primary-700: ${theme.colors.primary[700]};
    --primary-950: ${theme.colors.primary[950]};
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-tertiary: ${theme.colors.text.tertiary};
    --text-disabled: ${theme.colors.text.disabled};
    --text-inverse: ${theme.colors.text.inverse};
    --background: ${theme.colors.background};
    --surface: ${theme.colors.surface};
    --surface-elevated: ${theme.colors['surface-elevated']};
    --surface-glass: ${theme.colors['surface-glass']};
    --success: ${theme.colors.success[500]};
    --warning: ${theme.colors.warning[500]};
    --danger: ${theme.colors.danger[500]};
    --accent: ${theme.colors.accent[500]};
    --neutral-50: ${theme.colors.neutral[50]};
    --neutral-100: ${theme.colors.neutral[100]};
    --neutral-200: ${theme.colors.neutral[200]};
    --neutral-300: ${theme.colors.neutral[300]};
    --border-light: ${theme.colors.border.light};
    --border: ${theme.colors.border.DEFAULT};
    --border-dark: ${theme.colors.border.dark};
    --shadow-sm: ${theme.shadows.sm};
    --shadow: ${theme.shadows.DEFAULT};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    --shadow-xl: ${theme.shadows.xl};
    --shadow-2xl: ${theme.shadows['2xl']};
    --shadow-primary-sm: ${theme.shadows['primary-sm']};
    --shadow-primary-md: ${theme.shadows['primary-md']};
    --shadow-success-sm: ${theme.shadows['success-sm']};
    --shadow-glass: ${theme.shadows.glass};
    --shadow-inner: ${theme.shadows.inner};
    --shadow-none: ${theme.shadows.none};
    --radius-sm: ${theme.borderRadius.sm};
    --radius: ${theme.borderRadius.DEFAULT};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    --radius-2xl: ${theme.borderRadius['2xl']};
    --radius-full: ${theme.borderRadius.full};
    --gradient-primary: ${theme.gradients.primary};
    --gradient-primary-subtle: ${theme.gradients['primary-subtle']};
    --gradient-accent: ${theme.gradients.accent};
    --gradient-hero: ${theme.gradients.hero};
    --gradient-glass: ${theme.gradients.glass};
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fontFamily.sans.join(', ')};
    color: var(--text-primary);
    background: linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.neutral[50]} 100%);
    background-attachment: fixed;
    line-height: 1.6;
    min-height: 100vh;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    font-variant-numeric: oldstyle-nums;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: var(--text-primary);
    letter-spacing: -0.025em;
  }

  h1 { 
    font-size: 2.5rem; 
    font-weight: 700;
    letter-spacing: -0.05em;
  }
  h2 { 
    font-size: 2rem; 
    font-weight: 600;
  }
  h3 { 
    font-size: 1.75rem; 
    font-weight: 600;
  }
  h4 { 
    font-size: 1.5rem; 
    font-weight: 500;
  }
  h5 { 
    font-size: 1.25rem; 
    font-weight: 500;
  }
  h6 { 
    font-size: 1rem; 
    font-weight: 500;
  }

  p {
    margin-bottom: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
  }

  a {
    color: var(--primary-500);
    text-decoration: none;
    transition: var(--gradient-colors);
    font-weight: 500;

    &:hover {
      color: var(--primary-600);
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 2px;
    }
  }

  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button, input {
    overflow: visible;
  }

  button, select {
    text-transform: none;
  }

  button, [type="button"], [type="reset"], [type="submit"] {
    -webkit-appearance: button;
  }

  button:not(:disabled),
  [type="button"]:not(:disabled),
  [type="reset"]:not(:disabled),
  [type="submit"]:not(:disabled) {
    cursor: pointer;
  }

  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  .container {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 1rem;
    padding-left: 1rem;

    @media (min-width: 640px) {
      max-width: 640px;
    }

    @media (min-width: 768px) {
      max-width: 768px;
    }

    @media (min-width: 1024px) {
      max-width: 1024px;
    }

    @media (min-width: 1280px) {
      max-width: 1280px;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: 0.875rem;
    transition: var(--transition-colors);
    border: 1px solid transparent;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    &:hover::before {
      left: 100%;
    }

    &-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-primary-sm);

      &:hover {
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        box-shadow: var(--shadow-primary-md);
        transform: translateY(-1px);
      }
    }

    &-secondary {
      background-color: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);

      &:hover {
        background-color: var(--neutral-50);
        border-color: var(--primary-200);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }
    }

    &-ghost {
      background-color: transparent;
      color: var(--text-primary);
      border: 1px solid transparent;

      &:hover {
        background-color: var(--neutral-100);
        color: var(--primary-600);
      }
    }

    &-accent {
      background: var(--gradient-accent);
      color: white;
      box-shadow: 0 4px 14px 0 rgba(234, 179, 8, 0.39);

      &:hover {
        background: linear-gradient(135deg, #ca8a04 0%, #a16207 100%);
        box-shadow: 0 8px 25px 0 rgba(234, 179, 8, 0.5);
        transform: translateY(-1px);
      }
    }
  }

  .card {
    background-color: var(--surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow);
    padding: 2rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--border-light);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary-200), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-100);

      &::before {
        opacity: 1;
      }
    }
  }

  .glass {
    background: var(--surface-glass);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: var(--shadow-glass);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }

  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(1rem); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

`;

export default GlobalStyles;
