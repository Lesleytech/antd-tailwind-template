import { IAuthUser } from '~/lib/types/user';

export async function refreshToken(token: string) {
  // TODO: Implement the actual API call to refresh the token.
  return { email: '', accessToken: '', refreshToken: token } as IAuthUser;
}
