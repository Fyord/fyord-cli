import { Strings } from 'tsbase';
import { Template } from '../template';

export const StaticFunctionSpecTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const pascalCaseName = Strings.PascalCase(name);
  const camelCaseName = Strings.CamelCase(name);
  const extension = args?.[1] || Strings.Empty;
  const extensionIsJson = extension === 'json';

  return `import { Mock } from 'tsmockit';
import { IHttpClient } from 'tsbase/Net/Http/IHttpClient';
import ${pascalCaseName}, { endpoint } from '../${camelCaseName}.${extension}';

describe('${camelCaseName}.${extension}', () => {
  const mockHttpClient = new Mock<IHttpClient>();
  const successResponseBody = ${extensionIsJson ? '{}' : '\'worked!\''};

  beforeEach(() => {
    mockHttpClient.Setup(c => c.Get(endpoint), {
      ok: true,
      status: 200,
      statusText: 'ok',
      body: successResponseBody
    });
  });

  it('should return response when successful', async () => {
    const result = await ${pascalCaseName}(mockHttpClient.Object);
    expect(result).toEqual(${extensionIsJson ? 'JSON.stringify(successResponseBody)' : 'successResponseBody'});
  });

  it('should throw error on failure', async () => {
    mockHttpClient.Setup(c => c.Get(endpoint), {
      ok: false,
      status: 404,
      statusText: 'not found'
    });

    const errorRequestFunc = async () => {
      let error = '';
      try {
        await ${pascalCaseName}(mockHttpClient.Object);
      } catch (e) {
        error = e.message;
      }
      return error;
    };
    await expect(await errorRequestFunc()).toEqual('Unable to complete request - 404 | not found');
  });
});
`;
};
