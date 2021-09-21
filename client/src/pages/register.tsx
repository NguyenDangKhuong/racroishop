import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';

const Register = () => {
  return (
    <Wrapper>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={(values) => console.log(values)}
      >
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
  );
};

export default Register;
