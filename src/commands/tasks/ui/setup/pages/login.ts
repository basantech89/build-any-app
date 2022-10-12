import { writeToRoot } from 'utils/index'

const login = () => {
	writeToRoot(
		'src/pages/Login/index.tsx',
		`
      import Button from 'components/Button'
      import SmartForm, { SmartButton, SmartInput } from 'components/Form'
      
      import './styles.scss'
      
      import toastState from '../../atoms/toasts'
      
      import { routes } from 'constants/routes'
      import React from 'react'
      import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
      import { useNavigate } from 'react-router-dom'
      import { useRecoilState } from 'recoil'
      import { setItem } from 'utils'
      import { authenticateUser } from 'utils/api'

      export declare interface LoginForm {
        email: string
        password: string
      }
      
      const defaultValues: LoginForm = { email: '', password: '' }
      
      const Login = () => {
        const navigate = useNavigate()
      
        const [toasts, setToasts] = useRecoilState(toastState)
        const addToast = (msg: string, bg = 'success') => setToasts([...toasts, { msg, bg }])
      
        const [hidePass, setHidePass] = React.useState(true)
        const toggleHidePass = () => setHidePass(!hidePass)
      
        const login = async (user: LoginForm) => {
          const { data, error } = await authenticateUser(user)
          if (data) {
            setItem('token', data.token)
            navigate(routes.users)
          } else if (error) {
            addToast(error, 'danger')
          }
        }
      
        const goToSignup = () => navigate(routes.signup)
      
        return (
          <div className="login">
            <SmartForm<LoginForm>
              mode="onChange"
              onSubmit={login}
              defaultValues={defaultValues}
              className="login-form"
            >
              <h6>Hello there, Sign in to continue</h6>
              <SmartInput
                label="Email"
                name="email"
                className="login-form-group"
                rules={{
                  required: 'Email is required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
                    message: 'Invalid email address.'
                  }
                }}
              />
              <SmartInput
                label="Password"
                name="password"
                type={hidePass ? 'password' : 'text'}
                className="login-form-group"
                append={
                  <Button
                    onClick={toggleHidePass}
                    className="icon-btn input-icon-btn"
                    aria-label="Toggle Password Visibility"
                  >
                    {hidePass ? <EyeSlashFill /> : <EyeFill />}
                  </Button>
                }
                rules={{
                  required: 'Password is required.'
                }}
              />
              <SmartButton variant="primary" type="submit" label="Next" />
            </SmartForm>
            <Button variant="link" onClick={goToSignup}>
              Signup
            </Button>
          </div>
        )
      }
      
      export default Login
    `
	)

	writeToRoot(
		'src/pages/Login/styles.scss',
		`
      .login {
        width: 50%;
        display: grid;
        grid-template-rows: auto 40px;
        padding: 20px 0;
      
        & > * {
          margin: auto;
        }
      
        h6 {
          padding-bottom: 20px;
          color: #3c415e;
        }
      
        .login-form {
          width: 50%;
          .login-form-group {
            padding-bottom: 10px;
            position: relative;
            min-height: 100px;
      
            label {
              color: #9699a9;
            }
      
            input.form-control {
              height: 45px;
              font-weight: 500;
            }
      
            a {
              color: #1a1a1a;
              font-weight: 500;
              text-decoration: none;
            }
      
            .input-icon-btn {
              font-size: 1.3em;
              position: absolute;
              top: 50%;
              left: calc(100% - 35px);
              transform: translateY(-50%);
              color: #9699a9;
      
              svg {
                width: 18px;
                height: 18px;
              }
            }
          }
      
          button[type='submit'] {
            width: 100%;
            height: 45px;
            margin-top: 10px;
          }
        }
      
        .link-btn,
        .link-btn:active {
          margin-top: auto;
          margin-bottom: 20px;
          font-weight: 500;
          outline: none;
          box-shadow: none;
          text-decoration: none;
        }
      }
    `
	)

	writeToRoot(
		'src/pages/__tests__/login.test.tsx',
		`
			import Login from '../Login'

			import { axe } from 'jest-axe'
			import React from 'react'
			import render, { screen } from 'test-utils'
			
			describe('Login', () => {
			  test('snapshot test', () => {
			    const { container } = render(<Login />)
			    expect(container).toMatchInlineSnapshot()
			  })
			
			  test('Login component should be accessible', async () => {
			    const { container } = render(<Login />)
			    const result = await axe(container)
			    expect(result).toHaveNoViolations()
			  })
			
			  test('Next button should be disabled', () => {
			    render(<Login />)
			
			    const nextBtn = screen.getByText('Next')
			
			    expect(nextBtn).toBeInTheDocument()
			    expect(nextBtn).toBeDisabled()
			  })
			})
		`
	)
}

export default login
