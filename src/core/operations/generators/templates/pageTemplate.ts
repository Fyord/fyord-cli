import { Strings } from 'tsbase';
import { Template } from './template';

export const PageTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { Page, ParseJsx, Route } from 'fyord';
import styles from './${camelCaseName}.module.scss';

export class ${pascalCaseName} extends Page {
  Title = '${pascalCaseName}';
  Route = (route: Route) => route.path === '/${camelCaseName}';

  Html = async () => {
    return <div class={styles.container}>Hello ${name} page!</div>;
  }

  Behavior = () => { }
}
`;
};
