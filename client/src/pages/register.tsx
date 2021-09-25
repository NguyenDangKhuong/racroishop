import { Box, Button, Flex, Spinner, useToast } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import {
  MeDocument,
  MeQuery,
  RegisterInput,
  useRegisterMutation
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldError'
import { useCheckAuth } from '../utils/useCheckAuth'

const Register = () => {
  const router = useRouter()
  const { data: authData, loading: authLoading } = useCheckAuth()
  const initialValues: RegisterInput = {
    username: '',
    email: '',
    password: ''
  }

  const [registerUser, { loading: _registerUserLoading, data, error }] =
    useRegisterMutation()

  const toast = useToast()

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const res = await registerUser({
      variables: {
        registerInput: values
      },
      update(cache, { data }) {
        if (data?.register?.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.register.user }
          })
        }
      }
    })
    if (res.data?.register?.errors) {
      setErrors(mapFieldErrors(res.data.register.errors))
    } else if (res.data?.register?.user) {
      toast({
        title: 'Chào mừng',
        description: `${res.data.register.user.username}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      router.push('/')
    }
  }
  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent='center' alignItems='center' minH='100vh'>
          <Spinner />
        </Flex>
      ) : (
        <Wrapper size='small'>
          {error && <p>Đăng kí thất bại. Lỗi máy chủ</p>}
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
      )}
    </>
  )
}

export default Register
