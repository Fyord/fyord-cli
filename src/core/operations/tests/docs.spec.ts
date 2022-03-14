import { DocsOperation } from '../docs';

describe('DocsOperation', () => {
  let execCalledWithCommands: string[];
  let fakeChildProcess = {
    exec: (command: string, errorHandler: () => void) => {
      execCalledWithCommands.push(command);
      errorHandler();
    }
  } as any;

  let classUnderTest = new DocsOperation(fakeChildProcess);

  beforeEach(() => {
    execCalledWithCommands = [];
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should call exec with the "open" command and the given string arguments', async () => {
    const result = await classUnderTest.Execute(['one', 'two']);

    expect(result.IsSuccess).toBeTruthy();
    expect(execCalledWithCommands).toContain('open https://fyord.dev/docs?search=one%20two');
  });

  it('should call exec with the "start" command when an error occurs with the "open" command', async () => {
    fakeChildProcess = {
      exec: (command: string, errorHandler: (error?) => void) => {
        execCalledWithCommands.push(command);
        command.includes('open') ? errorHandler('error') : errorHandler();
      }
    } as any;
    classUnderTest = new DocsOperation(fakeChildProcess);

    const result = await classUnderTest.Execute(['one', 'two']);

    expect(result.IsSuccess).toBeTruthy();
    expect(execCalledWithCommands).toContain('open https://fyord.dev/docs?search=one%20two');
    expect(execCalledWithCommands).toContain('start https://fyord.dev/docs?search=one%20two');
  });

  it('should return failed result when both "open" and "start" command fail', async () => {
    fakeChildProcess = {
      exec: (command: string, errorHandler: (error?) => void) => {
        execCalledWithCommands.push(command);
        errorHandler('error');
      }
    } as any;
    classUnderTest = new DocsOperation(fakeChildProcess);

    const result = await classUnderTest.Execute(['one', 'two']);

    expect(result.IsSuccess).toBeFalsy();
  });
});
