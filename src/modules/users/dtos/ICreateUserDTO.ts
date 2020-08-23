export default interface ICreateUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  provider?: boolean;
  admin?: boolean;
}
