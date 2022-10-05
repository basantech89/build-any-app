import layouts from './layouts'

export declare interface UIStructure {
	layouts: () => UIStructure
}

const setupUI = () => {
	return {
		layouts,
	}
}

export default setupUI
