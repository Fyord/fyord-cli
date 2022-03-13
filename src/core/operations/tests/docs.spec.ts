import { Mock, Times } from 'tsmockit';
import { DocsOperation } from '../docs';

describe('DocsOperation', () => {
  let execCalledWithCommand: string;
  let execCalledWithHandler: (error: any) => void;
  const fakeChildProcess = {
    exec: (command: string, errorHandler: () => void) => {
      execCalledWithCommand = command;
      execCalledWithHandler = errorHandler;
    }
  } as any;
  const mockConsole = new Mock<Console>();

  const classUnderTest = new DocsOperation(fakeChildProcess, mockConsole.Object);

  beforeEach(() => {
    execCalledWithCommand = '';
    execCalledWithHandler = () => null;
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should call exec with the "open" command and the given string arguments', async () => {
    await classUnderTest.Execute(['one', 'two']);
    expect(execCalledWithCommand).toEqual('open https://fyord.dev/docs?search=one%20two');
  });

  it('should call exec with the "start" command when an error occurs with the "open" command', async () => {
    await classUnderTest.Execute(['one', 'two']);
    execCalledWithHandler('error');
    expect(execCalledWithCommand).toEqual('start https://fyord.dev/docs?search=one%20two');
  });

  it('should return failed result when both "open" and "start" command fail', async () => {
    mockConsole.Setup(c => c.error(''));

    await classUnderTest.Execute(['one', 'two']);
    execCalledWithHandler('error');
    execCalledWithHandler('error');

    mockConsole.Verify(c => c.error(''), Times.Once);
  });
});
