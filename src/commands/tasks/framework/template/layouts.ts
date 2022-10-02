import { writeToRoot } from './../../../../utils/index'
import { AppStructure } from './index'

function layouts(this: AppStructure) {
	writeToRoot(
		'src/layouts/AuthLayout/index.tsx',
		`
      import './styles.scss'

      import { getItem } from '../../utils'

      import React from 'react'
      import { Outlet, useNavigate } from 'react-router-dom'

      const AuthLayout = () => {
        const navigate = useNavigate()

        React.useEffect(() => {
          const token = getItem('token')
          if (token) {
            navigate('/users')
          }
        }, [])

        return (
          <div className="auth-layout">
            <div className="auth-layout-img" />
            <Outlet />
          </div>
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
        height: 100vh;

        &-img {
          background: url(https://source.unsplash.com/random/?people,dark,black,night) no-repeat;
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
          <div className="error-layout">
            <Outlet />
          </div>
        )
      }

      export default ErrorLayout
  `
	)

	writeToRoot(
		`src/layouts/ErrorLayout/styles.scss`,
		`
      .error-layout {
        height: 100vh;
      }
    `
	)

	writeToRoot(
		'src/layouts/ProtectedLayout/index.tsx',
		`
      import './styles.scss'

      import { routes } from '../../constants/routes'
      import { authenticate, logoutUser } from '../../utils'

      import React from 'react'
      import { Button, Navbar } from 'react-bootstrap'
      import { Link, Outlet, useNavigate } from 'react-router-dom'

      const ProtectedLayout = () => {
        const navigate = useNavigate()

        React.useEffect(() => {
          const isAuthenticated = authenticate()
          if (!isAuthenticated) {
            navigate('/')
          }
        }, [])

        return (
          <div className="protected-layout">
            <Navbar>
              <Navbar.Brand href="">
                <img
                  src="https://drive.google.com/uc?export=view&id=1hvRAGrdq0SqFBZApx2--IcuDf-DOmOBH"
                  alt="wissen-logo"
                />
              </Navbar.Brand>
              <Link to={routes.home}>
                <Button variant="danger" onClick={logoutUser} className="logout-btn">
                  Logout
                </Button>
              </Link>
            </Navbar>

            <Outlet />
          </div>
        )
      }

      export default ProtectedLayout
    `
	)

	writeToRoot(
		'src/layouts/ProtectedLayout/styles.scss',
		`
      .protected-layout {
        height: 100vh;
        padding: 50px;

        .navbar {
          justify-content: space-between;

          img {
            max-height: 50px;
          }
        }

        .logout-btn {
          a {
            text-decoration: none;
            color: inherit;
          }
        }
      }
  `
	)

	return this
}

export default layouts
