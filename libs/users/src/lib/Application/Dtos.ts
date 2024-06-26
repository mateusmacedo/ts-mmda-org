export type TRegisterUserDto = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export type TChangeUserEmailDto = {
  userId: string;
  newEmail: string;
};

export type TChangeUserPasswordDto = {
  userId: string;
  newPassword: string;
};
