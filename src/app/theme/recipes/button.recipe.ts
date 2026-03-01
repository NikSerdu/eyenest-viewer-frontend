import { defineRecipe } from '@chakra-ui/react/styled-system'

export const buttonRecipe = defineRecipe({
	className: 'chakra-button',
	base: {
		color: 'white',
		borderRadius: '{radii.xl}',
	},
	variants: {
		variant: {
			primary: {
				bg: 'button.primary.bg',
				_hover: {
					bg: 'button.primary.hoverBg',
					_active: {
						bg: 'button.primary.activeBg',
					},
				},
			},
		},
	},
})
