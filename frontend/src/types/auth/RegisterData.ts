type RegisterData = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  agreedToTerms: boolean;
  hash?: string;
};
export default RegisterData;
