import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Strings } from 'tsbase';
import { Template } from '../template';

export const PageTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { Page, ParseJsx, Route } from 'fyord';
import styles from './${camelCaseName}.module.${preferredStyleExtension}';

export class ${pascalCaseName} extends Page {
  Title = '${pascalCaseName}';
  Route = async (route: Route) => route.path === '/${camelCaseName}';

  Template = async () => {
    return <div class={styles.container}>Hello ${name} page!</div>;
  }
}
`;
};
