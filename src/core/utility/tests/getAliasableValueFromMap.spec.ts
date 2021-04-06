import { GetAliasableValueFromMap } from '../getAliasableValueFromMap';

describe('GetAliasableValueFromMap', () => {
  const testKey = 'test';
  const testAlias = 't';
  const testMap = new Map<string, { Alias: string }>([
    [testKey, { Alias: testAlias }]
  ]);

  it('should return the value of a keyed entry', () => {
    expect(GetAliasableValueFromMap(testMap, testKey)).toBeDefined();
  });

  it('should return the value of that corresponds to an alias', () => {
    expect(GetAliasableValueFromMap(testMap, testAlias)).toBeDefined();
  });

  it('should return undefined when there is no keyed entry value or value that corresponds to an alias', () => {
    expect(GetAliasableValueFromMap(testMap, 'fake')).toBeUndefined();
  });
});
