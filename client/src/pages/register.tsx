import { Box, Button } from '@chakra-ui/react'
import { Form, Formik, FormikHelper } from 'formik'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { RegisterInput, useRegisterMutation } from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldError'

const Register = () => {
  const initialValues: NewUserInput = {
    username: '',
    email: '',
    password: ''
  }

  const [registerUser, { loading: _registerUserLoading, data, error }] =
    useRegisterMutation()

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelper<RegisterInput>
  ) => {
    const res = await registerUser({
      variables: {
        registerInput: values
      }
    })
    if (res.data?.register?.errors) {
      setErrors(mapFieldErrors(res.data.register.errors))
    }
  }
  return (
    <Wrapper>
      {error && <p>Đăng kí thất bại</p>}
      {data && data?.register?.success && (
        <p>Đăng nhập thành công {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name='username'
                placeholder='Tên Đăng Nhập'
                label='Tên Đăng Nhập'
              />
            </Box>
            <Box mt={4}>
              <InputField
                name='email'
                placeholder='Email'
                label='Email'
                type='email'
              />
            </Box>
            <Box mt={4}>
              <InputField
                name='password'
                placeholder='Mật khẩu'
                label='Mật khẩu'
                type='password'
              />
            </Box>
            <Button
              type='submit'
              colorScheme='teal'
              mt={4}
              isLoading={isSubmitting}
            >
              Đăng kí
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Register
