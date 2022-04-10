import { Strings } from 'tsbase';
import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Template } from '../template';

export const ComponentTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;

  return `import { Component, ParseJsx, Jsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

type Props = {}

export class ${Strings.PascalCase(name)} extends Component {
  constructor(
    private props: Props = {},
    private children?: Jsx
  ) {
    super();
  }

  Template = async () => <div class={styles.container}>Hello ${name} component!</div>;
}
`;
};
