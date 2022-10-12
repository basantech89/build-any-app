import { UIStructure } from '../index'

import login from './login'
import signup from './signup'
import users from './users'

function pages(this: UIStructure) {
	login()
	signup()
	users()

	return this
}

export default pages
