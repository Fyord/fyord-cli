import { Strings } from 'tsbase';
import { Template } from '../template';

export const SingletonTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const pascalCaseName = Strings.PascalCase(name);

  return `export interface I${pascalCaseName} {

}

export class ${pascalCaseName} implements I${pascalCaseName} {
  private static instance: I${pascalCaseName} | null = null;
  public static Instance(): I${pascalCaseName} { return this.instance || (this.instance = new ${pascalCaseName}()); }
  public static Destroy = () => ${pascalCaseName}.instance = null;

  private constructor() { }
}
`;
};
