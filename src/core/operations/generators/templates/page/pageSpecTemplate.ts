import { Strings } from 'tsbase';
import { Template } from '../template';

export const PageSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const camelCaseName = Strings.CamelCase(name);
  const pascalCaseName = Strings.PascalCase(name);

  return `import { RenderModes, Route, TestHelpers } from 'fyord';
import { ${pascalCaseName} } from './${camelCaseName}';

describe('${pascalCaseName}', () => {
  let classUnderTest: ${pascalCaseName};
  const pageMocks = TestHelpers.GetComponentMocks();

  beforeEach(() => {
    classUnderTest = new ${pascalCaseName}(
      pageMocks.mockSeoService.Object,
      pageMocks.mockApp.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should have the correct render mode', () => {
    expect(classUnderTest.RenderMode = RenderModes.Hybrid);
  });

  it('should return true for routes that match', () => {
    const route = { path: '/${camelCaseName}' } as Route;
    expect(classUnderTest.Route(route)).toBeTruthy();
  });

  it('should return false for routes that do not match', () => {
    const route = { path: '/not-found' } as Route;
    expect(classUnderTest.Route(route)).toBeFalsy();
  });

  it('should render html', async () => {
    expect(await classUnderTest.Template()).toBeDefined();
  });

  it('should have appropriate behavior', async () => {
    document.body.innerHTML = await classUnderTest.Render();

    setTimeout(() => {
      // fire any attached events
    });

    const behaviorExpectationsMet = await TestHelpers.TimeLapsedCondition(() => {
      return true; // assertions proving expected behavior was met
    });
    expect(behaviorExpectationsMet).toBeTruthy();
  });
});
`;
};
