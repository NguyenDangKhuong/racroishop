import {
  FormLabel,
  FormControl,
  Input,
  FormErrorMessage,
  Select,
  Textarea,
  Icon,
  Button
} from '@chakra-ui/react'
import { useField } from 'formik'
import React, { ReactNode } from 'react'
import { FiFile } from 'react-icons/fi'
import InputUpload from './InputUpload'

interface InputFieldProps {
  name: string
  label: string
  placeholder: string
  type?: string
  selectoption?: ReactNode
}

const InputField = (props: InputFieldProps) => {
  const [field, { error }] = useField(props.name)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {props.type === 'textarea' ? (
        <Textarea {...field} id={field.name} {...props} />
      ) : props.type === 'select' ? (
        <Select {...field} id={field.name} {...props}>
          {props.selectoption}
        </Select>
      ) : props.type === 'upload' ? (
        <InputUpload accept={'image/*'} multiple>
          <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
        </InputUpload>
      ) : (
        <Input {...field} id={field.name} {...props} />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField
