import { DIModule, dryRunModule } from './diModule';

describe('DIModule', () => {
  it('should return dry run module dependencies when in dry run mode', () => {
    DIModule.DryRunMode = true;
    expect(DIModule.ChildProcess).toEqual(dryRunModule.ChildProcess);
    expect(DIModule.FileSystemAdapter).toEqual(dryRunModule.FileSystemAdapter);
    expect(DIModule.FileSystemExtraAdapter).toEqual(dryRunModule.FileSystemExtraAdapter);
  });

  it('child process should log commands to be executed', () => {
    const logSpy = spyOn(console, 'log');
    DIModule.DryRunMode = true;
    const cp = DIModule.ChildProcess;

    cp.exec('exec');
    cp.execSync('execSync');

    expect(logSpy).toHaveBeenCalledTimes(2);
  });
});
