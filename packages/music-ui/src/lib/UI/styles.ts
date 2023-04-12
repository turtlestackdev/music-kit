export interface StyleSet {
  bg: string
  text: string
  accent: string
  hover: string
}

export const styles = {
  info: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    accent: 'bg-blue-100',
    hover: 'bg-blue-500',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-green-600',
    accent: 'bg-green-100',
    hover: 'bg-green-500',
  },
  warning: {
    bg: 'bg-orange-600',
    text: 'text-orange-600',
    accent: 'bg-orange-100',
    hover: 'bg-orange-500',
  },
  error: {
    bg: 'bg-red-600',
    text: 'text-red-600',
    accent: 'bg-red-100',
    hover: 'bg-red-500',
  },
} as const
