import { Strings } from 'tsbase';
import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Template } from '../template';

export const ComponentTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;

  return `import { Component, ParseJsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

export class ${Strings.PascalCase(name)} extends Component {
  Template = async () => <div class={styles.container}>Hello ${name} component!</div>;
}
`;
};
