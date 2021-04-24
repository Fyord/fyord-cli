export enum Settings {
  BaseUrl = 'baseUrl',
  OutputPathRoot = 'outputPathRoot',
  BlockedResourceTypes = 'blockedResourceTypes',
  SkippedResources = 'skippedResources',
  BundleScriptRegex = 'bundleScriptRegex',
  AppRootString = 'appRootString'
}

export const SettingsMap = new Map<string, string>([
  [Settings.BaseUrl, 'http://localhost:7343'],
  [Settings.OutputPathRoot, 'public/pre-render'],
  [Settings.BlockedResourceTypes, 'image, media, font'],
  [Settings.SkippedResources, 'google'],
  [Settings.BundleScriptRegex, '<script src="\/bundle.js(.*?)"><\/script>']
]);
