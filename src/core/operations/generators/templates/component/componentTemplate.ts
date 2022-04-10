import { Strings } from 'tsbase';
import { ISettingsService, Settings, SettingsService } from '../../../../../settings/module';
import { Template } from '../template';

export const ComponentTemplate: Template = (
  args?: string[],
  settingsService: ISettingsService = SettingsService.Instance()) => {
  const preferredStyleExtension = settingsService.GetSettingOrDefault(Settings.StyleExtension);

  const name = args?.[0] || Strings.Empty;
  const withProps = args?.includes('props');

  return withProps ? `import { Component, ParseJsx, Jsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

type Props = {
  name?: string;
}

export class ${Strings.PascalCase(name)} extends Component {
  constructor(
    private props: Props = { name: '${name}'},
    private children?: Jsx
  ) {
    super();
  }

  Template = async () => <div class={styles.container}>
    <p>Hello {this.props.name} component!</p>
    {this.children}
  </div>;
}
` :
    `import { Component, ParseJsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.${preferredStyleExtension}';

export class ${Strings.PascalCase(name)} extends Component {
  constructor() {
    super();
  }

  Template = async () => <div class={styles.container}>Hello ${name} component!</div>;
}
`;
};
