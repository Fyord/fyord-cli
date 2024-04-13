export enum Directories {
  Static = './static',
  Gitignore = './.gitignore',
  RootPackage = './package.json',
  Electron = './node_modules/electron',
  ElectronPackager = './node_modules/electron-packager',
  WasmPack = './node_modules/wasm-pack',
  WebpackCommon = './webpack.common.js',
  WebpackDev = './webpack.dev.js',
  WebpackProd = './webpack.prod.js',
  CargoLock = './Cargo.lock',
  HtmlIndex = './src/index.html',
  TsIndex = './src/index.ts',
  WebManifest = './src/wwwroot/manifest.webmanifest',
  EsbuildBuild = './esbuild/build.ts',
  EsbuildOperations = './esbuild/buildOperations.ts'
}
