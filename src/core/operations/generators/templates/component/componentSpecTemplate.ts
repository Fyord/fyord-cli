import { Strings } from 'tsbase';
import { Template } from '../template';

export const ComponentSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { ${pascalCaseName} } from './${camelCaseName}';

describe('${pascalCaseName}', () => {
  let classUnderTest: ${pascalCaseName};

  beforeEach(() => {
    classUnderTest = new ${pascalCaseName}();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
`;
};
