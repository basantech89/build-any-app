import { writeToRoot } from 'utils/index'

const button = () => {
	writeToRoot(
		'src/components/Button/index.tsx',
		`
      import './styles.scss'
  
      import React from 'react'
      import { Button as RBButton, ButtonProps as RBButtonProps, Spinner } from 'react-bootstrap'
      declare interface ButtonProps extends RBButtonProps {
        loading?: boolean
      }
      
      const Button = ({ children, loading, ...rest }: ButtonProps) => {
        return (
          <RBButton {...rest}>
            {loading ? (
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              children
            )}
          </RBButton>
        )
      }
      
      export default Button
	`
	)

	writeToRoot(
		'src/components/Button/styles.scss',
		`
      .btn.btn-link {
        color: var(--bs-primary);
        text-decoration: none;
        text-shadow: none;
      
        &:hover {
          color: var(--bs-btn-hover-bg);
        }
        &:active {
          color: var(--bs-btn-active-bg);
          text-decoration: underline;
        }
      }
    `
	)
}

export default button
