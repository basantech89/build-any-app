import { writeToRoot } from 'utils/fs'

const signup = () => {
	writeToRoot(
		'src/pages/SignUp/index.tsx',
		`
			import Button from 'components/Button'
			import SmartForm, { SmartButton, SmartCheckbox, SmartInput } from 'components/Form'
			
			import { yupResolver } from '@hookform/resolvers/yup'
			import toastState from 'atoms/toasts'
			import { links } from 'constants/links'
			import { regex } from 'constants/regex'
			import { routes } from 'constants/routes'
			import React from 'react'
			import { Row } from 'react-bootstrap'
			import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
			import { useNavigate } from 'react-router-dom'
			import { useRecoilState } from 'recoil'
			import { registerUser } from 'utils/api'
			import { object, string } from 'yup'

			export declare interface SignUpForm {
				firstName: string
				lastName: string
				email: string
				password: string
				confirmPassword: string
				acceptTerms: boolean
			}

			const defaultValues: SignUpForm = {
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

			const SignUp = () => {
				const navigate = useNavigate()

				const [toasts, setToasts] = useRecoilState(toastState)
				const addToast = (msg: string, bg = 'success') => setToasts([...toasts, { msg, bg }])

				const [hidePass, setHidePass] = React.useState(true)
				const toggleHidePass = () => setHidePass(!hidePass)

				const [hideConfirmPass, setHideConfirmPass] = React.useState(true)
				const toggleHideConfirmPass = () => setHideConfirmPass(!hideConfirmPass)

				const goToLogin = () => navigate(routes.login)

				const signUpUser = async (formData: SignUpForm) => {
					const { success, data } = await registerUser(formData)
					if (success) {
						goToLogin()
					} else {
						addToast(data, 'danger')
					}
				}

				return (
					<section className="auth">
						<SmartForm<SignUpForm>
							mode="onChange"
							defaultValues={defaultValues}
							onSubmit={signUpUser}
							resolver={yupResolver(schema)}
							className="auth-form"
						>
							<Row>
								<SmartInput
									label="First Name"
									name="firstName"
									className="auth-form-group col-6"
									rules={{
										required: 'First Name is required.'
									}}
								/>
								<SmartInput label="Last Name" name="lastName" className="auth-form-group col-6" />
							</Row>
							<SmartInput
								label="Email"
								name="email"
								className="auth-form-group"
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
								className="auth-form-group"
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
								className="auth-form-group"
								append={
									<Button onClick={toggleHideConfirmPass} className="icon-btn input-icon-btn">
										{hideConfirmPass ? <EyeSlashFill /> : <EyeFill />}
									</Button>
								}
							/>
							<SmartCheckbox
								name="acceptTerms"
								className="auth-form-group"
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
						<Button variant="link" linkVariant="primary" onClick={goToLogin}>
							Login
						</Button>
					</section>
				)
			}

			export default SignUp
		`
	)
}

export default signup
