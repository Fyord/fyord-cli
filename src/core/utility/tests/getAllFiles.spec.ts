import { Mock } from 'tsmockit';
import { FileSystemAdapter } from '../../../fileSystem/fileSystemAdapter';
import { getAllFiles } from '../getAllFiles';

describe('getAllFiles', () => {
  const mockFsAdapter = new Mock<typeof FileSystemAdapter>();
  const firstDir = '/firstDir';
  const secondDir = 'secondDir';
  const testFile = 'testFile.txt';

  beforeEach(() => {
    mockFsAdapter.Setup(f => f.readdirSync(firstDir), [secondDir]);
    mockFsAdapter.Setup(f => f.readdirSync(secondDir), [testFile]);

    mockFsAdapter.Setup(f => f.statSync(firstDir), { isDirectory: () => true });
    mockFsAdapter.Setup(f => f.statSync(`${firstDir}/${secondDir}`), { isDirectory: () => true });
    mockFsAdapter.Setup(f => f.statSync(testFile), { isDirectory: () => false });
  });

  it('should get a list of all files', () => {
    const result = getAllFiles(firstDir, undefined, mockFsAdapter.Object);

    expect(result.length).toEqual(1);
    expect(result).toContain(`${firstDir}/${secondDir}/${testFile}`);
  });
});
