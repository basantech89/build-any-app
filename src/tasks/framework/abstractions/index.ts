import constants from './constants'
import routes from './routes'
import state from './state'
import utils from './utils'

import { writeToRoot } from 'utils/fs'

export declare interface AppStructure {
	routes: () => AppStructure
	utils: (globalStateLib?: string) => AppStructure
	constants: () => AppStructure
	state: (deps: string[], globalStateLib?: string) => AppStructure
}

const setupAbstractions = (useJest: boolean, globalStateLib?: string) => {
	const useRedux = globalStateLib === 'redux'

	writeToRoot(
		'src/index.tsx',
		`
    import Toast from 'components/Toast'

    import './App.scss'

    import AppRoutes from 'containers/AppRoutes'
    import Header from 'containers/Header'
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    ${useRedux ? "import { Provider } from 'react-redux'" : ''}
    import { BrowserRouter } from 'react-router-dom'
    import { RecoilRoot } from 'recoil'
    ${useRedux ? "import store from 'store'" : ''}

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

    ${
			useJest
				? `
        const startWorker = async () => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { worker } = require('./mocks/browser')
            worker.start()
          }
        }

        startWorker()
      `
				: ''
		}

    root.render(
      <React.StrictMode>
        ${useRedux ? '<Provider store={store}>' : ''}
          <RecoilRoot>
            <BrowserRouter>
              <Header />
              <AppRoutes />
              <Toast />
            </BrowserRouter>
          </RecoilRoot>
        ${useRedux ? '</Provider>' : ''}
      </React.StrictMode>
    )
  `
	)

	writeToRoot(
		'src/App.scss',
		`
      @import 'assets/styles/common';
      @import 'assets/styles/components';

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
          'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
      }

      h1,
      p {
        font-family: Lato;
      }

      #root {
        display: flex;
        flex-direction: column;
      }
    `
	)

	return {
		routes,
		utils,
		constants,
		state,
	}
}

export default setupAbstractions
