import UserOrganizationLogo from "./UserOrganizationLogo";

type UserOrganizationSaveForm = {
  id: number;
  name?: string;
  logo?: UserOrganizationLogo;
  description?: string;
};
export default UserOrganizationSaveForm;
