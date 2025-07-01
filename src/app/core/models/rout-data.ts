import { EnumLanguageModule } from '../constants/language-module.enum';
import { EnumPemission } from '../constants/pemission.enum';
import { EnumRole } from '../constants/roles.enum';

export interface RouteData {
  roles?: EnumRole[];
  permissions?: EnumPemission[];
  LanguageModules?: EnumLanguageModule[];
}
