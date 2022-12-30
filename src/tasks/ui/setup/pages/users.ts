import { writeToRoot } from 'utils/fs'

const users = (globalStateLib?: string) => {
	const useRedux = globalStateLib === 'redux'

	writeToRoot(
		'src/pages/Users/index.tsx',
		`
      import './styles.scss'
      
      ${
				useRedux
					? "import { useGetUsersQuery } from '../../store/usersSlice'"
					: "import useUsers from 'store/users'"
			}
      
      import React from 'react'
      import { Table } from 'react-bootstrap'
      
      const Users = () => {
        ${
					useRedux
						? `
                const { data, isLoading } = useGetUsersQuery(null)
                const users = data?.users || []
              `
						: `
                const { users, status, addUsers } = useUsers()
                const isLoading = status === 'pending' || status === 'idle'

                React.useEffect(() => {
                  addUsers()
                }, [])
              `
				}
            
        return (
          <React.Fragment>
            <h6> Users </h6>
            <Table striped bordered hover responsive className="users-table">
              <thead>
                <tr>
                  <td>First Name</td>
                  <td>Last Name</td>
                  <td>Email</td>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  users.map((user, id) => (
                    <tr key={id}>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </React.Fragment>
        )
      }
      
      export default Users
    `
	)

	writeToRoot(
		'src/pages/Users/styles.scss',
		`
      .protected-layout {
        height: 100vh;
        padding: 50px;
    
        h6 {
          padding: 30px 0 20px;
        }
      
        .users-table {
          padding: 20px;
        }
      }
    `
	)
}

export default users
