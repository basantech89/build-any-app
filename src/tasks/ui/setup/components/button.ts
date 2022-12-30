import { writeToRoot } from 'utils/fs'

const button = () => {
	writeToRoot(
		'src/components/Button/index.tsx',
		`
      import './styles.scss'

      import classNames from 'classnames'
      import React from 'react'
      import { Button as RBButton, ButtonProps as RBButtonProps, Spinner } from 'react-bootstrap'
      declare interface ButtonProps extends RBButtonProps {
        loading?: boolean
        linkVariant?: RBButtonProps['variant']
      }

      const Button = ({ children, className, loading, linkVariant, ...rest }: ButtonProps) => {
        return (
          <RBButton
            {...rest}
            className={classNames(className, {
              [\`link-\${linkVariant}\`]: rest.variant === 'link' && !!linkVariant
            })}
          >
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
        text-decoration: none;

        &:active {
          text-decoration: underline;
        }
      }

      button.icon-btn {
        display: inline-block;
        background-color: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        line-height: 16px;
        height: 30px;
        padding: 0 5px;
        display: flex;
        align-items: center;

        &:hover,
        &:active,
        &:focus,
        &:active:focus {
          background-color: var(--bs-primary);
        }
      }

      .btn:disabled {
        pointer-events: auto;
        cursor: not-allowed;
      }
    `
	)
}

export default button
