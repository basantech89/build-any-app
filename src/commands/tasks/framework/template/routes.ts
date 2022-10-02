import { writeToRoot } from './../../../../utils'
import { AppStructure } from './index'

function routes(this: AppStructure) {
	writeToRoot(
		'src/containers/AppRoutes.tsx',
		`
          import { routes } from '../constants/routes'
          import AuthLayout from '../layouts/AuthLayout'
          import ErrorLayout from '../layouts/ErrorLayout'
          import ProtectedLayout from '../layouts/ProtectedLayout'
          import Login from '../pages/Login'
          import Signup from '../pages/Signup'
          import Users from '../pages/Users'

          import React from 'react'
          import { Navigate, Route, Routes } from 'react-router-dom'

          const Error = () => (
            <div className="error-container">
              <div className="err-common-img error-img" />
              <div className="error-msg">You don't have access to this page.</div>
            </div>
          )

          const Nomatch = () => (
            <div className="error-container">
              <div className="err-common-img no-match-img" />
              <div className="error-msg">Page Not Found.</div>
            </div>
          )

          const AppRoutes = () => {
            return (
              <React.Fragment>
                <Routes>
                  <Route element={<ErrorLayout />}>
                    <Route path={routes.error} element={<Error />} />
                    <Route path="*" element={<Nomatch />} />
                  </Route>
                  <Route element={<AuthLayout />}>
                    <Route path={routes.home} element={<Navigate replace to={routes.login} />} />
                    <Route path={routes.login} element={<Login />} />
                    <Route path={routes.signup} element={<Signup />} />
                  </Route>
                  <Route element={<ProtectedLayout />}>
                    <Route path={routes.users} element={<Users />} />
                  </Route>
                </Routes>
              </React.Fragment>
            )
          }

          export default AppRoutes
        `
	)

	writeToRoot(
		'src/constants/routes.ts',
		`
          export const routes = {
            home: '/',
            users: '/users',
            error: '/error',
            login: '/login',
            signup: '/signup'
          }
        `
	)

	return this
}

export default routes
