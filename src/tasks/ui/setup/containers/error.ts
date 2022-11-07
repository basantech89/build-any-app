import { writeToRoot } from 'utils'

export const noMatch = () => {
	writeToRoot(
		'src/containers/NoMatch/index.tsx',
		`
      import React from 'react'

      const NoMatch = () => (
        <div className="error-container">
          <div className="err-common-img no-match-img" />
          <div className="error-msg">Page Not Found.</div>
        </div>
      )

      export default NoMatch
    `
	)
}

export const error = () => {
	writeToRoot(
		'src/containers/Error/index.tsx',
		`
      import './styles.scss'

      import React from 'react'

      const Error = () => (
        <div className="error-container">
          <div className="err-common-img error-img" />
          <div className="error-msg">You don't have access to this page.</div>
        </div>
      )

      export default Error
    `
	)

	writeToRoot(
		'src/containers/Error/styles.scss',
		`
      .error-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .err-common-img {
          height: 70%;
          width: 53%;
          min-height: 500px;
          background-size: contain;
          border-radius: 2px;
        }

        .error-img {
          background: url('https://i.postimg.cc/DfpxLX5N/8030434-3828547.jpg') no-repeat;
        }

        .no-match-img {
          background: url('https://i.postimg.cc/cJMvGfr4/5060708-2634442.jpg') no-repeat;
        }

        .error-msg {
          padding-top: 50px;
          font-weight: 500;
          font-size: 24px;
          font-family: 'Delius Unicase', cursive;
        }
      }
    `
	)
}
