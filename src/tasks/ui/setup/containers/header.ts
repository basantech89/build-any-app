import { writeToRoot } from 'utils/fs'

const header = () => {
	writeToRoot(
		'src/containers/Header/index.tsx',
		`
      import './styles.scss'

      import logo from 'assets/logos/build-any-app-logo.png'
      import darkTheme from 'assets/styles/themes/dark.lazy.scss'
      import lightTheme from 'assets/styles/themes/light.lazy.scss'
      import { routes } from 'constants/routes'
      import React from 'react'
      import { Button, Nav, Navbar } from 'react-bootstrap'
      import { Link } from 'react-router-dom'
      import { logoutUser } from 'utils'

      const Header = () => {
        const [isLightTheme, setIsLightTheme] = React.useState(true)

        const setLightTheme = () => {
          document.body.setAttribute('class', 'light-theme')
          darkTheme.unuse()
          lightTheme.use()
        }

        const setDarkTheme = () => {
          document.body.setAttribute('class', 'dark-theme')
          lightTheme.unuse()
          darkTheme.use()
        }

        React.useEffect(() => {
          setLightTheme()
        }, [])

        const toggleTheme = () => {
          setIsLightTheme(!isLightTheme)
          if (isLightTheme) {
            setDarkTheme()
          } else {
            setLightTheme()
          }
        }

        return (
          <>
            <Navbar expand="lg" className="px-5">
              <Navbar.Brand href="">
                <img src={logo} alt="Logo" className="brand-img" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Link to={routes.home} className="link-secondary">
                    Home
                  </Link>
                </Nav>
                <Nav>
                  <label className="theme-switcher">
                    <input type="checkbox" defaultChecked={isLightTheme} onChange={toggleTheme} />
                    <span className="slider" />
                  </label>
                  <Link to={routes.home}>
                    <Button variant="danger" onClick={logoutUser} className="logout-btn">
                      Logout
                    </Button>
                  </Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </>
        )
      }

      export default Header
    `
	)

	writeToRoot(
		'src/containers/Header/styles.scss',
		`
      .navbar {
        padding: 8px 30px 8px 50px;
        justify-content: space-between;

        .brand-img {
          max-height: 50px;
        }

        .logout-btn {
          a {
            text-decoration: none;
            color: inherit;
          }
        }
      }

      $switcher-container-height: 34px;
      $switcher-extra: 6px;

      .theme-switcher {
        position: relative;
        display: inline-block;
        width: 65px;
        margin-right: 20px;

        input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          border-radius: $switcher-container-height;

          &:before {
            position: absolute;
            content: '';
            height: calc($switcher-container-height + $switcher-extra);
            width: calc($switcher-container-height + $switcher-extra);
            inset: calc($switcher-extra / 2) 0 calc($switcher-extra / 2) 0;
            border-radius: 50%;
            background: url('../../assets/icons/night.png') no-repeat center;
            margin: auto 0;
            transition: 0.5s;
          }
        }

        input:checked + .slider {
          background-color: var(--primary);
        }

        input:checked + .slider:before {
          transform: translateX(-24px) rotate(-360deg);
          background: url('../../assets/icons/beach.png') no-repeat center;
        }
      }
    `
	)
}

export default header
