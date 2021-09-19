import { RegisterInput } from '../types/RegisterInput';

export const validateRegisterInput = (registerInput: RegisterInput) => {
  if (!registerInput.email.includes('@'))
    return {
      message: 'Email không đúng định dạng',
      error: [{ field: 'email', message: 'Email không đúng định dạng' }],
    };

  if (registerInput.username.length < 2)
    return {
      message: 'Tên không đúng',
      error: [
        {
          field: 'username',
          message: 'Tên đã nhập bắt buộc phải trên 2 kí tự',
        },
      ],
    };

  if (registerInput.username.includes('@'))
    return {
      message: 'Invalid username',
      error: [{ field: 'username', message: `Tên không được chứa @` }],
    };

  if (registerInput.password.length < 2)
    return {
      message: 'Invalid password',
      error: [
        {
          field: 'password',
          message: 'Password nhập phải trên 2 kí tự',
        },
      ],
    };

  return null;
};
