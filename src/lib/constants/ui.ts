/**
 * UI Constants for consistent styling and behavior
 */

// Color schemes for different UI elements
export const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  default: 'default',
} as const;

// Component sizes
export const SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

// Component variants
export const VARIANTS = {
  solid: 'solid',
  bordered: 'bordered',
  light: 'light',
  flat: 'flat',
  faded: 'faded',
  shadow: 'shadow',
} as const;

// Progress bar height options
export const PROGRESS_HEIGHTS = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

// Color classes for progress bars
export const PROGRESS_COLORS = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;
