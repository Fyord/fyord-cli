export const GetAliasableValueFromMap = <T>(map: Map<string, any>, keyOrAlias: string): T | undefined => {
  return map.has(keyOrAlias) ?
    map.get(keyOrAlias) :
    Array.from(map.values()).filter(g => g.Alias === keyOrAlias)[0];
};
