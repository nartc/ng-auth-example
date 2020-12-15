import { Translations } from '@volt/common/translations';
import { nameOf } from '../name-of/name-of';

export function translationKey(key: keyof Translations): keyof Translations {
  return nameOf<Translations>(key);
}
