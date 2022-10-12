import assets from './assets'
import components from './components'
import layouts from './layouts'
import pages from './pages'

export declare interface UIStructure {
	layouts: () => UIStructure
	components: () => UIStructure
	pages: () => UIStructure
	assets: (ui?: string) => UIStructure
}

const setupUI = () => {
	return {
		layouts,
		components,
		pages,
		assets,
	}
}

export default setupUI
