import { defineConfig } from '@chakra-ui/react'

import { semanticColors } from './semantic-tokens/colors.ts'
import { colors } from './tokens/colors.ts'
import { createSystem, defaultConfig } from '@chakra-ui/react'
import { recipes } from './recipes.ts'

const theme = defineConfig({
	preflight: true,
	cssVarsPrefix: 'chakra',
	cssVarsRoot: ':where(html, .chakra-theme)',
	theme: {
		tokens: {
			colors,
		},
		semanticTokens: {
			colors: semanticColors,
		},
		recipes: recipes,
	},
})

export const system = createSystem(defaultConfig, theme)
