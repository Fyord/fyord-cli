import { FileSystemDryRunAdapter } from '../fileSystemAdapter';

describe('FileSystemAdapter', () => {
  const logSpy = jest.spyOn(console, 'log');

  it('should log calls to mkdirSync', () => {
    FileSystemDryRunAdapter.mkdirSync('test');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should log calls to writeFileSync', () => {
    FileSystemDryRunAdapter.writeFileSync('test', '');
    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it('should log calls to rmdirSync', () => {
    FileSystemDryRunAdapter.rmdirSync('test', null);
    expect(logSpy).toHaveBeenCalledTimes(3);
  });

  it('should log calls to renameSync', () => {
    FileSystemDryRunAdapter.renameSync('test1', 'test2');
    expect(logSpy).toHaveBeenCalledTimes(4);
  });
});
