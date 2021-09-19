import { Mock, Times } from 'tsmockit';
import { DocsOperation } from '../docs';

describe('DocsOperation', () => {
  const mockChildProcess = new Mock<any>();
  const classUnderTest = new DocsOperation(mockChildProcess.Object);

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should call exec with the given string arguments', async () => {
    mockChildProcess.Setup(cp => cp.exec(''));
    mockChildProcess.Setup(cp => cp.exec('open https://fyord.dev/docs?search=one%20two'));

    await classUnderTest.Execute(['one', 'two']);

    mockChildProcess.Verify(cp => cp.exec('open https://fyord.dev/docs?search=one%20two'), Times.Once);
  });
});
