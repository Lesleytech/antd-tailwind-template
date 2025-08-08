export interface IAuthUser {
  email: string;
  accessToken: string;
  refreshToken: string;
  profile?: IUserProfile;
}

export interface IUserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
}
