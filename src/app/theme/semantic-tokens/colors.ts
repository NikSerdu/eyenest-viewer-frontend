import { defineSemanticTokens } from '@chakra-ui/react'

export const semanticColors = defineSemanticTokens.colors({
	button: {
		primary: {
			bg: { value: '{colors.brand.blue.500}' },
			hoverBg: { value: '{colors.brand.blue.600}' },
			activeBg: { value: '{colors.brand.blue.700}' },
			fg: { value: '{colors.white}' },
		},
	},
	bg: {
		DEFAULT: {
			value: '{colors.neutral.50}',
		},
	},
})
