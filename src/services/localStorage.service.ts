import localStore from 'store';

import { ColorMode } from '~/lib/types/colorMode';
import { IAuthUser } from '~/lib/types/user';

interface ILocalStorageItems {
  colorMode: ColorMode;
  authUser: Omit<IAuthUser, 'profile'>;
  i18nextLng: string;
}

export class LocalStorageService {
  static set<T extends keyof ILocalStorageItems>(key: T, value: ILocalStorageItems[T]) {
    localStore.set(key, value);
  }

  static get<T extends keyof ILocalStorageItems>(key: T): ILocalStorageItems[T] | null {
    return localStore.get(key) || null;
  }

  static remove<T extends keyof ILocalStorageItems>(key: T) {
    localStore.remove(key);
  }
}
