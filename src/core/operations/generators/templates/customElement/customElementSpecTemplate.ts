import { Strings } from 'tsbase';
import { Template } from '../template';

export const CustomElementSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const selector = args?.[1] || Strings.Empty;

  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { TestHelpers } from 'fyord';
import { ${pascalCaseName} } from './${camelCaseName}';

describe('${pascalCaseName}', () => {
  const fakeBody = document.createElement('div');
  let componentUnderTest: ${pascalCaseName};

  beforeEach(() => {
    componentUnderTest = new ${pascalCaseName}();
    fakeBody.innerHTML = '';
  });

  it('should construct', () => {
    expect(componentUnderTest).toBeDefined();
  });

  it('should init without attributes', async () => {
    await componentUnderTest.connectedCallback();

    const content = componentUnderTest.innerHTML;

    expect(content).toBeDefined();
    expect(content).toContain('dark');
  });

  it('should init with attributes', async () => {
    const selector = /*html*/ \`
      <${selector} myAttribute="test"></${selector}>\`;
    fakeBody.innerHTML = selector;

    const rendersExpectedValue = await TestHelpers.TimeLapsedCondition(() => {
      return fakeBody.innerHTML.includes('test');
    });
    expect(rendersExpectedValue).toBeTruthy();
  });
});
`;
};
