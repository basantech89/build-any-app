import assets from './assets'
import components from './components'
import containers from './containers'
import layouts from './layouts'
import pages from './pages'

export declare interface UIStructure {
	layouts: () => UIStructure
	components: () => UIStructure
	pages: (globalStateLib?: string) => UIStructure
	containers: () => UIStructure
	assets: (ui?: string) => UIStructure
}

const setupUI = () => {
	return {
		layouts,
		components,
		pages,
		assets,
		containers,
	}
}

export default setupUI
