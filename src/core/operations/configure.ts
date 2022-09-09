import * as _inquirer from 'inquirer';
import { AsyncCommand, Result } from 'tsbase';
import { SettingsService, SettingsMap } from '../../settings/module';
import { IOperation } from './operation';

export interface IInquirer {
  prompt(questions: { type: string, name: string, message: string }[]): Promise<any>;
}

export class ConfigureOperation implements IOperation {
  constructor(
    private settingsRepo = SettingsService.Instance().Repository,
    private inquirer: IInquirer = _inquirer
  ) { }

  public async Execute(): Promise<Result<null>> {
    return await new AsyncCommand(async () => {
      const questions = Array.from(SettingsMap.keys()).map(sk => ({
        type: 'input',
        name: sk,
        message: `${sk} (${SettingsMap.get(sk)})`
      }));

      const answers = await this.inquirer.prompt(questions) as Record<string, string>;

      for (const answerKey in answers) {
        const existingValue = this.settingsRepo.find(s => s.key === answerKey);
        const value = answers[answerKey];

        if (value) {
          existingValue ?
            existingValue.value = value :
            this.settingsRepo.push({ key: answerKey, value: value });
        } else if (existingValue) {
          this.settingsRepo.splice(this.settingsRepo.indexOf(existingValue), 1);
        }
      }

      this.settingsRepo.SaveChanges();
    }).Execute();
  }
}
