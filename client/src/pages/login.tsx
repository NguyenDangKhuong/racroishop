import { Box, Button, Flex, Link, Spinner, useToast } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldError'
import { useCheckAuth } from '../utils/useCheckAuth'

const Login = () => {
  const router = useRouter()

  const { data: authData, loading: authLoading } = useCheckAuth()

  const initialValues: LoginInput = {
    usernameOrEmail: '',
    password: ''
  }

  const [loginUser, { loading: _loginUserLoading, data, error }] =
    useLoginMutation()

  const toast = useToast()
  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const res = await loginUser({
      variables: {
        loginInput: values
      },
      update(cache, { data }) {
        // console.log('DATA LOGIN', data)

        // const meData = cache.readQuery({ query: MeDocument })
        // console.log('MEDATA', meData)

        //querry lại data me để check user đăng nhập chưa
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user }
          })
        }
      }
    })
    if (res.data?.login?.errors) {
      setErrors(mapFieldErrors(res.data.login.errors))
    } else if (res.data?.login?.user) {
      // login successfully
      toast({
        title: 'Chào mừng trở lại',
        description: `${res.data.login.user.username}`,
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
          {error && <p>Đăng nhập thất bại. Lỗi máy chủ</p>}
          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Box mt={4}>
                  <InputField
                    name='usernameOrEmail'
                    placeholder='Tên Đăng Nhập hoặc Email'
                    label='Tên Đăng Nhập hoặc Email'
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
                <Flex mt={2}>
                  <NextLink href='/forgot-password'>
                    <Link ml='auto'>Forgot Password</Link>
                  </NextLink>
                </Flex>
                <Button
                  type='submit'
                  colorScheme='teal'
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Đăng nhập
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  )
}

export default Login
