import { AppStructure } from '.'

import { writeToRoot } from 'utils/fs'

function state(this: AppStructure, deps: string[], globalStateLib?: string) {
	const useRedux = globalStateLib === 'redux'
	const useZustand = globalStateLib === 'zustand'

	if (globalStateLib === 'zustand') {
		deps.push(globalStateLib, 'immer')
	} else {
		deps.push('react-redux', '@reduxjs/toolkit')
	}

	if (useRedux) {
		writeToRoot(
			'src/store/usersSlice.ts',
			`
        import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
        import { getItem, toCamelCaseKeys } from 'utils'

        export declare interface User {
          firstName: string
          lastName: string
          email: string
          userId: string
        }

        export const usersApi = createApi({
          reducerPath: 'usersApi',
          baseQuery: fetchBaseQuery({
            baseUrl: process.env.REACT_APP_API_BASE,
            prepareHeaders: headers => {
              const token = getItem('token')
              if (token) {
                headers.set('Authorization', \`Bearer \${token}\`)
              }

              return headers
            }
          }),
          endpoints: builder => ({
            getUsers: builder.query<{ users: User[]; success: boolean }, null>({
              query: () => \`users\`,
              transformResponse: (response: { data: User[]; success: boolean }) =>
                toCamelCaseKeys({ users: response.data, ...response })
            })
          })
        })

        export const { useGetUsersQuery } = usersApi
      `
		)

		writeToRoot(
			'src/store/todosSlice.ts',
			`
        import { RootState } from '.'

        import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
        import { addTodo as apiAddTodo, fetchTodos } from 'src/services/api'

        type Status = 'idle' | 'pending' | 'success' | 'failed'

        export interface Todo {
          title: string
          description: string
          done: boolean
          createdAt: string
          updatedAt: string
          todoId: string
        }
        
        export type UITodo = Pick<Todo, 'title' | 'description' | 'done'>

        export type TodoState = {
          todos: Record<string, Todo>
          status: Status
        }

        export const addTodos = createAsyncThunk('todos/addTodos', async () => {
          const { success, data } = await fetchTodos()
          if (success) {
            return {
              todos: data.reduce((allTodos, todo) => {
                allTodos[todo.todoId] = todo
                return allTodos
              }, {} as TodoState['todos']),
              status: 'success'
            }
          }
          return { todos: {}, status: 'failed' }
        })

        export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Todo) => {
          const { success, data } = await apiAddTodo(todo)
          if (success) {
            return {
              todo: data,
              status: 'success'
            }
          }
          return { status: 'failed' }
        })

        const initialState: TodoState = {
          status: 'idle',
          todos: {}
        }

        const todosSlice = createSlice({
          name: 'todos',
          initialState,
          reducers: {},
          extraReducers(builder) {
            builder
              .addCase(addTodos.pending, state => {
                state.status = 'pending'
              })
              .addCase(addTodos.fulfilled, (state, action) => {
                state.status = 'success'
                state.todos = action.payload.todos
              })
              .addCase(addTodos.rejected, state => {
                state.status = 'failed'
              })
              .addCase(addTodo.fulfilled, (state, action) => {
                const { todo } = action.payload
                if (todo) {
                  state.todos[todo.todoId] = todo
                }
              })
          }
        })

        export default todosSlice.reducer

        export const selectTodos = (state: RootState) => state.todos
      `
		)

		writeToRoot(
			'src/store/index.ts',
			`
        import todosReducer from './todosSlice'
        import { usersApi } from './usersSlice'
    
        import { configureStore } from '@reduxjs/toolkit'
        import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
        
        const store = configureStore({
          reducer: {
            [usersApi.reducerPath]: usersApi.reducer,
            todos: todosReducer
          },
          middleware: getDefaultMiddleware => getDefaultMiddleware().concat(usersApi.middleware)
        })
        
        export default store

        export type RootState = ReturnType<typeof store.getState>
        export type AppDispatch = typeof store.dispatch

        export const useAppDispatch: () => AppDispatch = useDispatch
        export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
      `
		)
	} else if (useZustand) {
		writeToRoot(
			'src/store/todos.ts',
			`
        import {
          addTodo as apiAddTodo,
          fetchTodos,
          removeTodo as apiRemoveTodo,
          updateTodo as apiUpdateTodo
        } from 'src/services/api'
        import create from 'zustand'
        import { immer } from 'zustand/middleware/immer'

        export interface Todo {
          title: string
          description: string
          done: boolean
          createdAt: string
          updatedAt: string
          todoId: string
        }

        export type UITodo = Pick<Todo, 'title' | 'description' | 'done'>

        type Status = 'idle' | 'pending' | 'success' | 'failed'

        export type TodoState = {
          todos: Record<string, Todo>
          status: Status
        }

        type Actions = {
          addTodos: () => void
          addTodo: (todo: UITodo) => void
          removeTodo: (todoId: string) => void
          updateTodo: (updatedTodo: Todo) => void
        }

        const useTodos = create(
          immer<TodoState & Actions>(set => ({
            todos: {},
            status: 'idle',
            addTodo: todo => {
              apiAddTodo(todo).then(({ success, data }) => {
                if (success) {
                  set(state => (state.todos[data.todoId] = data))
                }
              })
            },
            addTodos: async () => {
              set({ status: 'pending' })
              const { success, data } = await fetchTodos()
              if (success) {
                set({
                  status: 'success',
                  todos: data.reduce((allTodos, todo) => {
                    allTodos[todo.todoId] = todo
                    return allTodos
                  }, {} as TodoState['todos'])
                })
              } else {
                set({ status: 'failed' })
              }
            },
            removeTodo: todoId => {
              apiRemoveTodo(todoId).then(({ success }) => {
                if (success) {
                  set(state => delete state.todos[todoId])
                }
              })
            },
            updateTodo: newTodo => {
              apiUpdateTodo(newTodo).then(({ success, data }) => {
                if (success) {
                  set(state => (state.todos[newTodo.todoId] = data))
                }
              })
            }
          }))
        )

        export default useTodos
      `
		)

		writeToRoot(
			'src/store/users.ts',
			`
        import { fetchUsers } from 'src/services/api'
        import create from 'zustand'
        import { immer } from 'zustand/middleware/immer'

        export declare interface User {
          firstName: string
          lastName: string
          email: string
          userId: string
        }

        type Status = 'idle' | 'pending' | 'success' | 'failed'

        export type UserState = {
          users: User[]
          status: Status
        }

        type Actions = {
          addUsers: () => void
        }

        const useUsers = create(
          immer<UserState & Actions>(set => ({
            users: [],
            status: 'idle',
            addUsers: async () => {
              set({ status: 'pending' })
              const { success, data } = await fetchUsers()
              if (success) {
                set({
                  status: 'success',
                  users: data
                })
              } else {
                set({ status: 'failed' })
              }
            }
          }))
        )

        export default useUsers
      `
		)
	}

	return this
}

export default state
