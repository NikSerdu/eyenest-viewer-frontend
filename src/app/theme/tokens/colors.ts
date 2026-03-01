import { defineTokens } from '@chakra-ui/react'

export const colors = defineTokens.colors({
	brand: {
		blue: {
			50: { value: '#eff6ff' },
			100: { value: '#dbeafe' },
			200: { value: '#bfdbfe' },
			300: { value: '#93c5fd' },
			400: { value: '#60a5fa' },
			500: { value: '#3b82f6' },
			600: { value: '#2563eb' },
			700: { value: '#1d4ed8' },
			800: { value: '#1e40af' },
			900: { value: '#1e3a8a' },
		},
	},

	neutral: {
		50: { value: '#f8f9fa' },
		100: { value: '#f3f3f5' },
		200: { value: '#ececf0' },
		300: { value: '#d1d5db' },
		400: { value: '#9ca3af' },
		500: { value: '#717182' },
		600: { value: '#4b5563' },
		700: { value: '#374151' },
		800: { value: '#1f2937' },
		900: { value: '#111827' },
	},

	slate: {
		50: { value: '#f8fafc' },
		100: { value: '#f1f5f9' },
		200: { value: '#e2e8f0' },
		300: { value: '#cbd5e1' },
		400: { value: '#94a3b8' },
		500: { value: '#64748b' },
		600: { value: '#475569' },
		700: { value: '#334155' },
		800: { value: '#1e293b' },
		900: { value: '#0f172a' },
	},

	success: {
		50: { value: '#ecfdf5' },
		100: { value: '#d1fae5' },
		500: { value: '#10b981' },
		600: { value: '#059669' },
		700: { value: '#047857' },
	},

	warning: {
		50: { value: '#fffbeb' },
		100: { value: '#fef3c7' },
		500: { value: '#f59e0b' },
		600: { value: '#d97706' },
		700: { value: '#b45309' },
	},

	error: {
		50: { value: '#fef2f2' },
		100: { value: '#fee2e2' },
		500: { value: '#ef4444' },
		600: { value: '#dc2626' },
		700: { value: '#b91c1c' },
	},

	info: {
		50: { value: '#eff6ff' },
		100: { value: '#dbeafe' },
		500: { value: '#3b82f6' },
		600: { value: '#2563eb' },
		700: { value: '#1d4ed8' },
	},

	recording: { value: '#ef4444' },
	live: { value: '#10b981' },
	offline: { value: '#6b7280' },
	paused: { value: '#f59e0b' },
})
