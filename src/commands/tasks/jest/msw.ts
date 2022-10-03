import { runCommands, writeToRoot } from '../../../utils'

const setupMSW = () => {
	writeToRoot(
		'src/mocks/handlers.ts',
		`
      import { rest } from 'msw'
      import { constructUrl } from 'utils/client'

      export const handlers = [
        rest.post(constructUrl('auth/login'), (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.delay(2000),
            ctx.json({
              success: true,
              message: 'User signed in successfully.',
              data: {
                id: '1234',
                first_name: 'John',
                last_name: 'Smith',
                email: 'test@example.com',
                token: '123456'
              }
            })
          )
        }),
        rest.post(constructUrl('auth/register'), (req, res, ctx) => {
          return res(
            ctx.status(201),
            ctx.delay(2000),
            ctx.json({
              success: true,
              message: 'User successfully signed up.'
            })
          )
        })
      ]
    `
	)

	writeToRoot(
		'src/mocks/server.ts',
		`
      import { handlers } from './handlers'

      import { setupServer } from 'msw/node'

      // This configures a request mocking server with the given request handlers.
      export const server = setupServer(...handlers)
  `
	)

	writeToRoot(
		'src/mocks/browser.ts',
		`
      import { handlers } from './handlers'

      import { setupWorker } from 'msw'

      // This configures a Service Worker with the given request handlers.
      export const worker = setupWorker(...handlers)
	  `
	)

	runCommands(`npx msw init ${global.rootDir}/public --save`)
}

export default setupMSW
