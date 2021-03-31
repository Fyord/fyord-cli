import { Strings } from 'tsbase';
import { Template } from '../template';

export const SingletonSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const pascalCaseName = Strings.PascalCase(name);

  return `describe('${pascalCaseName}', () => {
  let classUnderTest: I${pascalCaseName};

  beforeEach(() => {
    classUnderTest = ${pascalCaseName}.Instance();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
`;
};
