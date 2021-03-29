export enum Settings {
  BaseUrl = 'baseUrl',
  OutputPathRoot = 'outputPathRoot',
  BlockedResourceTypes = 'blockedResourceTypes',
  SkippedResources = 'skippedResources',
  DynamicRenderModeString = 'dynamicRenderModeString',
  StaticRenderModeString = 'staticRenderModeString',
  HybridRenderModeString = 'hybridRenderModeString',
  BundleScriptRegex = 'bundleScriptRegex',
  UnsupportedBrowserScript = 'unsupportedBrowserScript',
  AppRootString = 'appRootString'
}

export const SettingsMap = new Map<string, any>([
  [Settings.BaseUrl, 'http://localhost:4200'],
  [Settings.OutputPathRoot, 'public/pre-render'],
  [Settings.BlockedResourceTypes, ['image', 'media', 'font']],
  [Settings.SkippedResources, ['google', 'paypal', 'gstatic']],
  [Settings.DynamicRenderModeString, '<!-- fyord-dynamic-render -->'],
  [Settings.StaticRenderModeString, '<!-- fyord-static-render -->'],
  [Settings.HybridRenderModeString, '<!-- fyord-hybrid-render -->'],
  [Settings.BundleScriptRegex, '<script src="\/bundle.js(.*?)"><\/script>'],
  [Settings.UnsupportedBrowserScript, '<script src="/unsupported-browser.js"></script>'],
  [Settings.AppRootString, '<div id="app-root">']
]);
