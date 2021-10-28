import { ISettingsService } from '../../../../settings/settingsService';

export type Template = (
  args?: string[],
  settingsService?: ISettingsService
) => string;
