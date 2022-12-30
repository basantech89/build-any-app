import { writeToRoot } from 'utils/fs'

const form = () => {
	writeToRoot(
		'src/components/Form/index.tsx',
		`
      import './styles.scss'

      import { callAll, omit } from '../../utils'
      import Button from '../Button'

      import classNames from 'classnames'
      import React from 'react'
      import { ButtonProps, Form, FormControlProps, FormProps } from 'react-bootstrap'
      import {
        FieldValues,
        FormProvider,
        SubmitHandler,
        useController,
        UseControllerProps,
        useForm,
        useFormContext,
        UseFormProps
      } from 'react-hook-form'

      declare interface SmartFormProps<TFormValues extends FieldValues>
        extends UseFormProps<TFormValues> {
        onSubmit?: SubmitHandler<TFormValues>
        children?: React.ReactNode
        className?: string
      }

      export default function SmartForm<TFormValues extends FieldValues>({
        onSubmit,
        children,
        className,
        ...rest
      }: SmartFormProps<TFormValues>) {
        const methods = useForm(rest)
        const { handleSubmit } = methods

        const formProps: FormProps = { className: classNames(className) }
        if (onSubmit) {
          formProps.onSubmit = handleSubmit(onSubmit)
        }

        return <FormProvider {...methods} children={<Form {...formProps}>{children}</Form>} />
      }

      declare type Trigger<TFieldValues> = TFieldValues[keyof TFieldValues]
      declare interface SmartFormChildProps<TFieldValues extends FieldValues>
        extends UseControllerProps<TFieldValues> {
        label?: React.ReactNode | string
        children?: React.ReactNode
        className?: string
        type?: string
        triggers?: Trigger<TFieldValues>[]
      }

      declare interface InputProps<TFieldValues extends FieldValues>
        extends SmartFormChildProps<TFieldValues>,
          Omit<FormControlProps, 'defaultValue'> {
        append?: React.ReactNode
      }

      export const SmartInput = <TFieldValues extends FieldValues = FieldValues>({
        label,
        append,
        className,
        triggers,
        ...rest
      }: InputProps<TFieldValues>) => {
        const {
          control,
          formState: { errors },
          trigger,
          getFieldState
        } = useFormContext()

        const triggerField = (currTrigger: Trigger<TFieldValues>) => {
          const { isTouched } = getFieldState(currTrigger)
          if (isTouched) {
            trigger(currTrigger)
          }
        }

        const { field } = useController({ ...rest, ...control })

        const error = errors?.[rest.name]?.message as string

        const onChange = () => {
          if (triggers) {
            triggers.forEach(triggerField)
          }
        }

        return (
          <Form.Group className={classNames(className)}>
            <Form.Label htmlFor={rest.name}>{label}</Form.Label>
            <div className="append">
              <Form.Control
                {...omit(field, 'ref', 'onChange')}
                {...rest}
                id={rest.name}
                onChange={callAll(field.onChange, onChange)}
              />
              {append}
            </div>
            {error && <div className="error">{error}</div>}
          </Form.Group>
        )
      }

      export function SmartCheckbox<TFieldValues extends FieldValues = FieldValues>({
        className,
        ...rest
      }: SmartFormChildProps<TFieldValues>) {
        const {
          control,
          formState: { errors }
        } = useFormContext()
        const { field } = useController({ ...rest, ...control })

        const error = errors?.[rest.name]?.message as string

        return (
          <Form.Group className={classNames(className)}>
            <Form.Check {...omit(field, 'ref')} {...rest} type="checkbox" id={rest.name} />
            {error && <div className="error">{error}</div>}
          </Form.Group>
        )
      }

      declare interface SmartButtonProps extends ButtonProps {
        label: string
      }

      export const SmartButton: React.FC<SmartButtonProps> = ({ label, ...rest }) => {
        const {
          formState: { isValid, isDirty, isSubmitting }
        } = useFormContext()

        const shouldDisableSubmit = !isDirty || !isValid

        return (
          <Button disabled={shouldDisableSubmit} loading={isSubmitting} {...rest}>
            {label}
          </Button>
        )
      }
    `
	)

	writeToRoot(
		'src/components/Form/styles.scss',
		`
      .append {
        position: relative;
      }
    `
	)
}

export default form
