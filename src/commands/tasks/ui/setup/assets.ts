import { UIStructure } from './index'

import { writeToRoot } from 'utils/index'

function assets(this: UIStructure, uiLib?: string) {
	if (uiLib === 'react-bootstrap') {
		writeToRoot(
			'src/assets/styles/theme.scss',
			`
				$theme-colors: map-merge($theme-colors, ("primary": #112B3C));
	
				/* import bootstrap to set changes */
				@import "~bootstrap/scss/bootstrap";
			`
		)
	}

	return this
}

export default assets
