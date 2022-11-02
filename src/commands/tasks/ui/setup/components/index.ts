import { UIStructure } from '..'

import button from './button'
import form from './form'
import toast from './toast'

function components(this: UIStructure) {
	button()
	form()
	toast()

	return this
}

export default components
