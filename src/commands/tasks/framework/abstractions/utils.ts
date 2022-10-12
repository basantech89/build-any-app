import { writeToRoot } from './../../../../utils'
import { AppStructure } from './index'

function utils(this: AppStructure) {
	writeToRoot(
		'src/utils/index.ts',
		`
      import { get, post, remove } from './client'

      export const getItem = (key: string) => localStorage.getItem(key)
      export const setItem = (key: string, value: string) => localStorage.setItem(key, value)

      export const removeItem = (key: string) => localStorage.removeItem(key)

      export const logoutUser = async () => {
        removeItem('token')
      }

      export const authenticate = () => {
        const token = getItem('token')
        return !!token
      }

      export const registerForUserInactivitySession = () => {
        setInterval(() => {
          const lastUserActivityTimestamp = getItem('lastUserActivityTimestamp')
          const currentToken = getItem('token')

          if (lastUserActivityTimestamp && currentToken) {
            const timeSpentInMinutes = Math.ceil((Date.now() - +lastUserActivityTimestamp) / 60000)
            if (timeSpentInMinutes > 5) {
              removeItem('token')
              removeItem('lastLoginTimestamp')
              window.location.href = '/'
            }
          }
        }, 60000)
      }

      export const registerForUserActivityTracking = () => {
        const setUserActivityTimeStamp = () => {
          setItem('lastUserActivityTimestamp', \`\${Date.now()}\`)
        }
        window.document.addEventListener('click', setUserActivityTimeStamp)
        window.document.addEventListener('keypress', setUserActivityTimeStamp)
      }

      interface Omit {
        <T extends Record<string, unknown>, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
          [K2 in Exclude<keyof T, K[number]>]: T[K2]
        }
      }

      export const omit: Omit = (obj, ...props) => {
        const result = { ...obj }
        props.forEach(function (prop) {
          delete result[prop]
        })
        return result
      }

      export const isObject = function (obj: unknown) {
        return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function'
      }

      interface CallBack<Params extends any[]> {
        (...args: Params): void
      }

      export const callAll =
        <Params extends any[]>(...fns: Array<CallBack<Params> | undefined>) =>
        (...args: Params) =>
          fns.forEach(fn => typeof fn === 'function' && fn(...args))

      type CamelToSnake<T extends string> = string extends T
        ? string
        : T extends \`\${infer C0}\${infer R}\`
        ? \`\${C0 extends Lowercase<C0> ? '' : '_'}\${Lowercase<C0>}\${CamelToSnake<R>}\`
        : ''

      export type CamelKeysToSnake<T> = {
        [K in keyof T as CamelToSnake<Extract<K, string>>]: T[K]
      }

      const snakeCase = (str: string) => str.replace(/[A-Z]/g, letter => \`_\${letter.toLowerCase()}\`)

      export function toSnakeCaseKeys<T extends Record<string, any>>(obj: T): CamelKeysToSnake<T> {
        const newO: Record<string, any> = {}
        let origKey, newKey, value
        for (origKey in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, origKey)) {
            newKey = snakeCase(origKey)
            value = obj[origKey]
            if (value instanceof Array || (!!value && value.constructor === Object)) {
              value = toSnakeCaseKeys(value)
            }
            newO[newKey] = value
          }
        }
        return newO as CamelKeysToSnake<T>
      }

      type SnakeToCamelCase<S extends string> = S extends \`\${infer T}_\${infer U}\`
        ? \`\${T}\${Capitalize<SnakeToCamelCase<U>>}\`
        : S

      export type SnakeKeysToCamel<T extends Record<string, any>> = {
        [K in keyof T as SnakeToCamelCase<Extract<K, string>>]: T[K]
      }

      const camelCase = (str: string) =>
        str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

      export function toCamelCaseKeys<T extends Record<string, any>>(o: T): SnakeKeysToCamel<T> {
        const newO: Record<string, any> = {}
        let origKey, newKey, value
        for (origKey in o) {
          if (Object.prototype.hasOwnProperty.call(o, origKey)) {
            newKey = camelCase(origKey)
            value = o[origKey]
            if (value instanceof Array || (value !== null && value.constructor === Object)) {
              value = toCamelCaseKeys(value)
            }
            newO[newKey] = value
          }
        }
        return newO as SnakeKeysToCamel<T>
      }

      export { get, post, remove }
    `
	)

	writeToRoot(
		'src/utils/client.ts',
		`
      import { getItem, toCamelCaseKeys, toSnakeCaseKeys } from '.'

      export const constructUrl = (url: string) => {
        if (process.env.REACT_APP_API_BASE) {
          return \`\${process.env.REACT_APP_API_BASE}/\${url}\`
        }
        return url
      }

      const getHeaders = (authenticate: boolean) => {
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        }

        if (authenticate) {
          const token = getItem('token')
          if (token) {
            headers.Authorization = \`Bearer \${token}\`
          }
        }

        return headers
      }

      declare interface APICallOptions<D> {
        method: RequestInit['method']
        data?: D
        authenticate: boolean
      }

      type APIResponse<R> = {
        success: boolean
        error?: string
        data?: R
      }

      const apiCall = async <R, D = undefined>(
        url: string,
        options: APICallOptions<D>
      ): Promise<APIResponse<R>> => {
        try {
          const headers = getHeaders(options.authenticate)

          const fetchOptions: RequestInit = {
            method: options.method,
            headers
          }

          if (options.data) {
            const snakeCaseData = toSnakeCaseKeys(options.data)
            fetchOptions.body = JSON.stringify(snakeCaseData)
          }

          const response = await fetch(constructUrl(url), fetchOptions)
          const rawData = await response.json()
          const { success, data, error } = toCamelCaseKeys(rawData)
          if (error) {
            return { success, error }
          }
          return { data, success }
        } catch (e) {
          return { success: false, error: (e as Error)?.message as string }
        }
      }

      export const get = async <R>(url: string, authenticate = true) =>
        apiCall<R>(url, { method: 'GET', authenticate })

      export const post = async <R, D>(url: string, data: D, authenticate = true) =>
        apiCall<R, D>(url, { method: 'POST', data, authenticate })

      export const remove = async <R>(url: string, authenticate = true) =>
        apiCall<R>(url, { method: 'DELETE', authenticate })
    `
	)

	writeToRoot(
		'src/utils/api.ts',
		`
      import { LoginForm } from 'pages/Login'
      import { SignupForm } from 'pages/Signup'
      import { get, post, remove } from 'utils'

      declare interface User {
        token: string
        firstName: string
        lastName: string
        email: string
        id: string
      }

      export const authenticateUser = (user: LoginForm) =>
        post<User, LoginForm>('auth/login', user, false)

      export const registerUser = (user: SignupForm) =>
        post<never, SignupForm>('auth/register', user, false)

      export const fetchUsers = () => get<User[]>('users')

      export const logout = () => remove<never>('auth/logout')
    `
	)

	writeToRoot(
		'src/utils/__tests__/common.test.ts',
		`
			import { describe, expect, test } from '@jest/globals'
			import { regex } from 'constants/regex'
			
			describe('REGEX', () => {
			  test('International Characters', () => {
			    const i18Regex = regex.i18nChars
			    expect(i18Regex.test('AAA erferfr')).toStrictEqual(false)
			    expect(i18Regex.test('lowercase')).toStrictEqual(true)
			    expect(i18Regex.test('UPPERCASE')).toStrictEqual(true)
			    expect(i18Regex.test('camelCase')).toStrictEqual(true)
			    expect(i18Regex.test('snake_case')).toStrictEqual(true)
			    expect(i18Regex.test('hyphen-test-utils')).toStrictEqual(true)
			    expect(i18Regex.test('caseWith966')).toStrictEqual(true)
			    expect(i18Regex.test('哈德良')).toStrictEqual(true)
			    expect(i18Regex.test('кириллица')).toStrictEqual(true)
			    expect(i18Regex.test('Ajúmmááwí')).toStrictEqual(true)
			    expect(i18Regex.test('ɔbuleɔyʋɛ')).toStrictEqual(true)
			    expect(i18Regex.test('бызшва')).toStrictEqual(true)
			    expect(i18Regex.test('تونسي')).toStrictEqual(true)
			    // expect(i18Regex.test-utils('हिन्दी')).toStrictEqual(true)
			  })
			
			  test('Password Regex', () => {
			    const password = regex.password
			    expect(password.test('1234')).toStrictEqual(false)
			    expect(password.test('lower')).toStrictEqual(false)
			    expect(password.test('UPPER')).toStrictEqual(false)
			    expect(password.test('lowerUPPER')).toStrictEqual(false)
			    expect(password.test('lowerUPPER1234')).toStrictEqual(false)
			    expect(password.test('lowerUPPER#@1234')).toStrictEqual(true)
			    expect(password.test('lL@1')).toStrictEqual(false)
			    expect(
			      password.test('lowerUPPER#@123467890lowerUPPER#@123467890lowerUPPER#@123467890')
			    ).toStrictEqual(false)
			  })
			})
		`
	)

	return this
}

export default utils
