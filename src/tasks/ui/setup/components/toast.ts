import { writeToRoot } from 'utils/fs'

const toast = () => {
	writeToRoot(
		'src/components/Toast/index.tsx',
		`
      import './styles.scss'

      import toastState from 'atoms/toasts'      
      import React from 'react'
      import { Toast as RBToast, ToastContainer } from 'react-bootstrap'
      import { useRecoilState } from 'recoil'

      const Toast = () => {
        const [toasts, setToasts] = useRecoilState(toastState)
      
        const shiftToast = () => {
          const dup = [...toasts]
          dup.shift()
          setToasts(dup)
        }
      
        return (
          <ToastContainer position="bottom-end" className="rb-toast">
            {toasts.map((toast, idx) => (
              <RBToast key={idx} bg={toast?.bg} onClose={shiftToast} delay={1500} autohide>
                <RBToast.Body>{toast?.msg}</RBToast.Body>
              </RBToast>
            ))}
          </ToastContainer>
        )
      }
      
      export default Toast
    `
	)

	writeToRoot(
		'src/components/Toast/styles.scss',
		`
      @keyframes bounce {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        40% {
          transform: translateY(-5px);
        }
        60% {
          opacity: 1;
          transform: translateY(5px);
        }
        100% {
          transform: translateY(0);
        }
      }
      
      .rb-toast {
        padding-bottom: 20px;
        padding-right: 10px;
        .toast {
          animation: bounce 1s ease-in-out;
          .toast-body {
            color: white;
          }
        }
        .toast.show {
          animation: bounce 1s ease-in-out;
        }
      }
    `
	)
}

export default toast
