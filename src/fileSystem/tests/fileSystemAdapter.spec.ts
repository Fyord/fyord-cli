import { FileSystemDryRunAdapter } from '../fileSystemAdapter';

describe('FileSystemAdapter', () => {
  it('should log calls to mkdirSync', () => {
    const logSpy = spyOn(console, 'log');
    FileSystemDryRunAdapter.mkdirSync('test');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should log calls to writeFileSync', () => {
    const logSpy = spyOn(console, 'log');
    FileSystemDryRunAdapter.writeFileSync('test', '');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should log calls to rmdirSync', () => {
    const logSpy = spyOn(console, 'log');
    FileSystemDryRunAdapter.rmdirSync('test');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should log calls to renameSync', () => {
    const logSpy = spyOn(console, 'log');
    FileSystemDryRunAdapter.renameSync('test1', 'test2');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
