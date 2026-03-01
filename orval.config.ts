import { defineConfig } from 'orval'

export default defineConfig({
	cameraApp: {
		input: 'http://localhost:4000/openapi.yaml',
		output: {
			schemas: './src/api/generated',
			target: './src/api/generated',
		},
	},
})

// import { defineConfig } from 'orval'

// export default defineConfig({
// 	cameraApp: {
// 		output: {
// 			mode: 'tags-split',
// 			target: './src/api/generated/cameraApp.ts',
// 			schemas: './src/api/generated/model',
// 			client: 'react-query',
// 			override: {
// 				mutator: {
// 					path: './src/api/axios/authInstance.ts',
// 					name: 'authInstance',
// 				},
// 			},
// 		},
// 		input: {
// 			target: 'http://localhost:4000/openapi.yaml',
// 		},
// 		hooks: {
// 			afterAllFilesWrite: 'prettier --write',
// 		},
// 	},
// })
