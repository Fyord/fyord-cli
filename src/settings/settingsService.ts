import { FSPersister, IPersister, Repository, Strings } from 'tsbase';
import { PathResolver } from '../fileSystem/pathResolver';
import { Settings, SettingsMap } from './settings';
import { GetConfigurationFileName } from './getConfigurationFileName';
import { DIModule } from '../diModule';

export interface ISettingsService {
  Repository: Repository<Record<string, string>>;
  GetSettingOrDefault(settingName: Settings): string;
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static Instance(
    persister: IPersister<Record<string, string>> = new FSPersister(
      './',
      GetConfigurationFileName(),
      'settings',
      PathResolver,
      DIModule.FileSystemAdapter)
  ): ISettingsService {
    return this.instance || (this.instance = new SettingsService(persister));
  }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<Record<string, string>>;

  private constructor(persister: IPersister<Record<string, string>>) {
    console.log(`Using configuration file at ${persister['filePath']}`);
    this.Repository = Repository.New(persister);
  }

  public GetSettingOrDefault(settingName: Settings): string {
    const setting = this.Repository.find(s => s.key === settingName);
    return setting && (typeof setting.value === 'object' || !Strings.IsEmptyOrWhiteSpace(setting.value)) ?
      setting.value :
      SettingsMap.get(settingName) || Strings.Empty;
  }
}
