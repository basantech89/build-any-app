import { AppStructure } from './index'

import { writeToRoot } from 'utils/index'

function state(this: AppStructure) {
	writeToRoot(
		'src/redux-store/index.ts',
		`
      import { usersApi } from './usersSlice'
  
      import { configureStore } from '@reduxjs/toolkit'
      
      const store = configureStore({
        reducer: {
          [usersApi.reducerPath]: usersApi.reducer
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(usersApi.middleware)
      })
      
      export default store
    `
	)

	return this
}
