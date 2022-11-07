import { UIStructure } from '..'

import { error, noMatch } from './error'
import header from './header'

function containers(this: UIStructure) {
	header()
	noMatch()
	error()

	return this
}

export default containers
