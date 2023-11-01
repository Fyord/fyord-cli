import { Strings } from 'tsbase';
import { Template } from '../template';

export const ComponentSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { Expect } from 'tsmockit';
import { Asap } from 'fyord';
import { TestHelpers } from 'fyord/utilities/testHelpers';
import { ${pascalCaseName} } from './${camelCaseName}';

describe('${pascalCaseName}', () => {
  let classUnderTest: ${pascalCaseName};

  beforeEach(() => {
    classUnderTest = new ${pascalCaseName}();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should render template', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    Asap(() => {
      // fire any attached events
    });

    await Expect(
      () => true, // returns the result of this function once truthy to the following function for assertions
      (m) => m.toBeTruthy());
  });
});
`;
};
