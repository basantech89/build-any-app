import { UIStructure } from './index'

import { writeToRoot } from 'utils/fs'

function layouts(this: UIStructure) {
	writeToRoot(
		'src/layouts/AuthLayout/index.tsx',
		`
      import './styles.scss'

      import React from 'react'
      import { Outlet, useNavigate } from 'react-router-dom'
      import { getItem } from 'utils'

      const AuthLayout = () => {
        const navigate = useNavigate()

        React.useEffect(() => {
          const token = getItem('token')
          if (token) {
            navigate('/users')
          }
        }, [])

        return (
          <main className="auth-layout">
            <section className="auth-layout-img" />
            <Outlet />
          </main>
        )
      }

      export default AuthLayout

    `
	)

	writeToRoot(
		`src/layouts/AuthLayout/styles.scss`,
		`
      .auth-layout {
        display: flex;
        height: calc(100vh - 76px);

        &-img {
          min-width: 50%;
          background-size: cover;
        }
      }
    `
	)

	writeToRoot(
		'src/layouts/ErrorLayout/index.tsx',
		`
      import './styles.scss'

      import React from 'react'
      import { Outlet } from 'react-router-dom'

      const ErrorLayout = () => {
        return (
          <main className="error-layout">
            <Outlet />
          </main>
        )
      }

      export default ErrorLayout
  `
	)

	writeToRoot(
		`src/layouts/ErrorLayout/styles.scss`,
		`
      .error-layout {
        height: calc(100vh - 76px);
      }
    `
	)

	writeToRoot(
		'src/layouts/ProtectedLayout/index.tsx',
		`
      import './styles.scss'

      import React from 'react'
      import { Outlet, useNavigate } from 'react-router-dom'
      import { authenticate } from 'utils'

      const ProtectedLayout = () => {
        const navigate = useNavigate()

        React.useEffect(() => {
          const isAuthenticated = authenticate()
          if (!isAuthenticated) {
            navigate('/')
          }
        }, [])

        return (
          <main className="protected-layout">
            <Outlet />
          </main>
        )
      }

      export default ProtectedLayout
    `
	)

	writeToRoot(
		'src/layouts/ProtectedLayout/styles.scss',
		`
      .protected-layout {
        padding: 40px;
      }
    `
	)

	return this
}

export default layouts
