import { UIStructure } from '../index'

import login from './login'
import signup from './signup'
import todos from './todos'
import users from './users'

function pages(this: UIStructure, globalStateLib?: string) {
	login()
	signup()
	users(globalStateLib)
	todos(globalStateLib)

	return this
}

export default pages
