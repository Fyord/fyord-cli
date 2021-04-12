import * as inquirer from 'inquirer';
import { AsyncCommand, Result } from 'tsbase';
import { SettingsService, SettingsMap } from '../../settings/module';
import { IOperation } from './operation';

export class ConfigureOperation implements IOperation {
  public async Execute(): Promise<Result> {
    return await new AsyncCommand(async () => {
      const settingsRepo = SettingsService.Instance().Repository;

      const questions = Array.from(SettingsMap.keys()).map(sk => ({
        type: 'input',
        name: sk,
        message: `${sk} (${SettingsMap.get(sk)})`
      }));

      const answers = await inquirer.prompt(questions) as Record<string, string>;

      for (const answerKey in answers) {
        const existingValue = settingsRepo.Find(s => s.key === answerKey);
        const value = answers[answerKey];

        if (value) {
          existingValue ?
            existingValue.value = value :
            settingsRepo.Add({ key: answerKey, value: value });
        } else if (existingValue) {
          settingsRepo.Remove(existingValue);
        }
      }

      settingsRepo.SaveChanges();
    }).Execute();
  }
}
