import { Strings } from 'tsbase';
import { Template } from '../template';

export const CustomElementSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;

  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { TestHelpers } from 'fyord/utilities/testHelpers';
import { ${pascalCaseName} } from './${camelCaseName}';

describe('${pascalCaseName}', () => {
  let componentUnderTest: ${pascalCaseName};

  beforeEach(() => {
    componentUnderTest = new ${pascalCaseName}();
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without attributes', async () => {
    await componentUnderTest.connectedCallback();
    const content = componentUnderTest.innerHTML;
    expect(content).toBeDefined();
  });

  it('should init with attributes', async () => {
    componentUnderTest.setAttribute('myAttribute', 'test');
    componentUnderTest.attributeChangedCallback();

    await componentUnderTest.connectedCallback();

    const content = componentUnderTest.innerHTML;
    expect(content).toBeDefined();
  });
});
`;
};
