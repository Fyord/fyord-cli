import * as child_process from 'child_process';
import { AsyncCommand, Result } from 'tsbase';
import { IOperation } from './operation';

export class DocsOperation implements IOperation {
  constructor(
    private cp = child_process
  ) { }

  public async Execute(args: string[]): Promise<Result> {
    return await new AsyncCommand(async () => {
      const docsPageOrigin = 'https://fyord.dev/docs?search=';
      const query = encodeURIComponent(args.join(' '));
      const docsPageUrl = `${docsPageOrigin}${query}`;

      const success = await new Promise<boolean>(resolve => {
        const executeUsingCommand = (command: 'open' | 'start', errorHandler: (resolve) => void) =>
          this.cp.exec(`${command} ${docsPageUrl}`, (stderr) => {
            stderr ? errorHandler(resolve) : resolve(true);
          });

        executeUsingCommand('open', async () => {
          executeUsingCommand('start', () => {
            resolve(false);
          });
        });
      });

      if (!success) {
        throw new Error(`Unable to open system browser via terminal using "open" or "start" command(s).
You may still visit the docs page via this url: ${docsPageUrl}`);
      }
    }).Execute();
  }
}
