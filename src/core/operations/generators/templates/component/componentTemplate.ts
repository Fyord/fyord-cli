import { Strings } from 'tsbase';
import { Template } from '../template';

export const ComponentTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;

  return `import { Component, ParseJsx } from 'fyord';
import styles from './${Strings.CamelCase(name)}.module.scss';

export class ${Strings.PascalCase(name)} extends Component {
  Template = async () => <div class={styles.container}>Hello ${name} component!</div>;
}
`;
};
