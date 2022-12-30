import { TaskArgs } from '.'

import { writeObjToRoot } from 'utils/fs'

const tsConfig = {
	compilerOptions: {
		target: 'es5',
		lib: ['dom', 'dom.iterable', 'esnext'],
		allowJs: true,
		skipLibCheck: true,
		esModuleInterop: true,
		allowSyntheticDefaultImports: true,
		strict: true,
		forceConsistentCasingInFileNames: true,
		noFallthroughCasesInSwitch: true,
		module: 'esnext',
		moduleResolution: 'node',
		resolveJsonModule: true,
		isolatedModules: true,
		noEmit: true,
		jsx: 'react-jsx',
		baseUrl: 'src',
	},
	include: ['.'],
}

const typescript = ({ devDeps }: TaskArgs) => {
	devDeps.push('typescript')

	writeObjToRoot('tsconfig.json', tsConfig)
}

typescript.displayName = 'typescript'
export default typescript
