import { writeToRoot } from 'utils'

import routes from './routes'
import utils from './utils'

export declare interface AppStructure {
	routes: () => AppStructure
	utils: () => AppStructure
}

const setupAbstractions = (useJest: boolean) => {
	writeToRoot(
		'src/index.tsx',
		`
    import './App.scss'

    import Toast from './components/Toast'
    import AppRoutes from './containers/AppRoutes'
    import store from './redux-store'

    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import { Provider } from 'react-redux'
    import { BrowserRouter } from 'react-router-dom'
    import { RecoilRoot } from 'recoil'

    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

    ${
			useJest &&
			`
        if (process.env.NODE_ENV === 'development') {
          import('./mocks/browser').then(({ worker }) => {
            worker.start()
          })
        }
    `
		}

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <RecoilRoot>
            <BrowserRouter>
              <AppRoutes />
              <Toast />
            </BrowserRouter>
          </RecoilRoot>
        </Provider>
      </React.StrictMode>
    )
  `
	)

	return {
		routes,
		utils,
	}
}

export default setupAbstractions
