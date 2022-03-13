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

      await this.cp.exec(`open ${docsPageUrl}`, async stderr => {
        if (stderr) {
          this.executeUsingStartCommand(docsPageUrl);
        }
      });
    }).Execute();
  }

  private async executeUsingStartCommand(docsPageUrl: string): Promise<void> {
    await this.cp.exec(`start ${docsPageUrl}`, stderr => {
      if (stderr) {
        throw new Error(`Unable to open system browser via terminal using "open" or "start" command(s).
You may still visit the docs page directly at: ${docsPageUrl}`);
      }
    });
  }
}
