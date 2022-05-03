import { Strings } from 'tsbase';
import { Template } from '../template';

export const StaticFunctionTemplate: Template = (args?: string[]) => {
  const name = args?.[0] || Strings.Empty;
  const extension = args?.[1] || Strings.Empty;
  const pascalCaseName = Strings.PascalCase(name);

  const typeName = `${pascalCaseName}Type`;

  return extension === 'json' ? `import { IHttpClient } from 'tsbase/Net/Http/module';
type ${typeName} = {
  categories: string[],
  created_at: string,
  icon_url: string,
  id: string,
  url: string,
  value: string
};

export const endpoint = 'https://api.chucknorris.io/jokes/random';

export default async function ${pascalCaseName}(httpClient: IHttpClient): Promise<string> {
  const response = await httpClient.Get<${typeName}>(endpoint);

  if (!response.ok) {
    throw new Error(\`Unable to complete request - \${response.status} | \${response.statusText}\`);
  }

  return JSON.stringify(response.body);
}
` : `import { IHttpClient } from 'tsbase/Net/Http/module';

export const endpoint = 'https://foaas.com/cup/joe';

export default async function ${pascalCaseName}(httpClient: IHttpClient): Promise<string> {
  const response = await httpClient.Get<string>(endpoint);

  if (!response.ok) {
    throw new Error(\`Unable to complete request - \${response.status} | \${response.statusText}\`);
  }

  return response.body;
}
`;
};
