import { writeToRoot } from 'utils/index'

const signup = () => {
	writeToRoot(
		'src/pages/Signup/index.tsx',
		`
			import toastState from '../../atoms/toasts'
			import SmartForm, { SmartButton, SmartCheckbox, SmartInput } from '../../components/Form'
			import { links } from '../../constants/links'
			import { regex } from '../../constants/regex'
			import { routes } from '../../constants/routes'
			import { registerUser } from '../../utils/api'
			
			import { yupResolver } from '@hookform/resolvers/yup'
			import React from 'react'
			import { Button, Row } from 'react-bootstrap'
			import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
			import { useNavigate } from 'react-router-dom'
			import { useRecoilState } from 'recoil'
			import { object, string } from 'yup'
			
			export declare interface SignupForm {
			  firstName: string
			  lastName: string
			  email: string
			  password: string
			  confirmPassword: string
			  acceptTerms: boolean
			}
			
			const defaultValues: SignupForm = {
			  firstName: '',
			  lastName: '',
			  email: '',
			  password: '',
			  confirmPassword: '',
			  acceptTerms: false
			}
			
			const schema = object().shape({
			  firstName: string()
			    .trim()
			    .required('First Name is required.')
			    .matches(regex.i18nChars, 'Illegal characters.')
			    .max(64, 'Must be less than 64 characters.'),
			  lastName: string()
			    .matches(regex.i18nChars, 'Illegal characters.')
			    .max(64, 'Must be less than 64 characters.'),
			  email: string()
			    .trim()
			    .required('Email is required.')
			    .email('Must be a valid email address.')
			    .max(255, 'Must be less than 255 characters.'),
			  password: string()
			    .required('Password is required.')
			    .min(8, 'Must be at least 8 characters long.')
			    .max(20, 'Must be less than 20 characters.')
			    .matches(
			      regex.password,
			      'Must contain at least one digit, one lowercase, one uppercase and one special character.'
			    )
			    .trim(),
			  confirmPassword: string()
			    .trim()
			    .required('Confirm Password is required.')
			    .when(['password'], {
			      is: (password?: string) => !!password,
			      then: string().test('match-check', "Passwords don't match.", function (value) {
			        return !!value && value === this.parent.password
			      })
			    })
			})
			
			const Signup = () => {
			  const navigate = useNavigate()
			
			  const [toasts, setToasts] = useRecoilState(toastState)
			  const addToast = (msg: string, bg = 'success') => setToasts([...toasts, { msg, bg }])
			
			  const [hidePass, setHidePass] = React.useState(true)
			  const toggleHidePass = () => setHidePass(!hidePass)
			
			  const [hideConfirmPass, setHideConfirmPass] = React.useState(true)
			  const toggleHideConfirmPass = () => setHideConfirmPass(!hideConfirmPass)
			
			  const goToLogin = () => navigate(routes.login)
			
			  const signupUser = async (formData: SignupForm) => {
			    const data = await registerUser(formData)
			    if (data.success) {
			      goToLogin()
			    } else if (data.error) {
			      addToast(data.error, 'danger')
			    }
			  }
			
			  return (
			    <div className="login">
			      <SmartForm<SignupForm>
			        mode="onChange"
			        defaultValues={defaultValues}
			        onSubmit={signupUser}
			        resolver={yupResolver(schema)}
			        className="login-form"
			      >
			        <Row>
			          <SmartInput
			            label="First Name"
			            name="firstName"
			            className="login-form-group col-6"
			            rules={{
			              required: 'First Name is required.'
			            }}
			          />
			          <SmartInput label="Last Name" name="lastName" className="login-form-group col-6" />
			        </Row>
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
			          triggers={['confirmPassword']}
			          append={
			            <Button onClick={toggleHidePass} className="icon-btn input-icon-btn">
			              {hidePass ? <EyeSlashFill /> : <EyeFill />}
			            </Button>
			          }
			        />
			        <SmartInput
			          label="Confirm Password"
			          name="confirmPassword"
			          type={hideConfirmPass ? 'password' : 'text'}
			          className="login-form-group"
			          append={
			            <Button onClick={toggleHideConfirmPass} className="icon-btn input-icon-btn">
			              {hideConfirmPass ? <EyeSlashFill /> : <EyeFill />}
			            </Button>
			          }
			        />
			        <SmartCheckbox
			          name="acceptTerms"
			          className="login-form-group"
			          label={
			            <div>
			              By creating or logging into account, you are agreeing with our{' '}
			              <a href={links.termsAndConditions}>Terms & Conditions</a> and{' '}
			              <a href={links.privacyTerms}> Privacy Policy</a>.
			            </div>
			          }
			          rules={{
			            required: 'Terms & Conditions are required.'
			          }}
			        />
			        <SmartButton variant="primary" type="submit" label="Next" />
			      </SmartForm>
			      <Button variant="link" onClick={goToLogin}>
			        Login
			      </Button>
			    </div>
			  )
			}
			
			export default Signup
    `
	)
}

export default signup
