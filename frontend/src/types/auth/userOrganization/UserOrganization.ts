import UserOrganizationLogo from "./UserOrganizationLogo";

type UserOrganization = {
  [key: string]: any;
  id: number;
  name: string;
  logo: UserOrganizationLogo;
  isDefault?: boolean;
  description: string;
  inviteLink: string;
};
export default UserOrganization;
