import { Strings } from 'tsbase';
import { Template } from '../template';

export const WebComponentSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;

  const pascalCaseName = Strings.PascalCase(name);

  return `import { ${pascalCaseName} } from './${Strings.CamelCase(name)}';

describe('${pascalCaseName}', () => {
  let componentUnderTest: ${pascalCaseName};

  beforeEach(() => {
    componentUnderTest = new ${pascalCaseName}();
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without data', async () => {
    await componentUnderTest.connectedCallback();
    const content = (componentUnderTest.shadowRoot as ShadowRoot).innerHTML;
    expect(content).toBeDefined();
  });
});
`;
};
