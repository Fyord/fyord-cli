export enum Commands {
  InstallWasmPack = 'npm install --save-dev wasm-pack@^0.12.1',
  WasmPackBuild = 'npx wasm-pack build --target=web',
  FyordBuildStatic = 'npx fyord bs',
  InstallElectron = 'npm install --save-dev electron@^20.0.3',
  InstallElectronPackager = 'npm install --save-dev electron-packager@^15.5.1',
  ElectronServe = 'npx electron public/main.js'
}
