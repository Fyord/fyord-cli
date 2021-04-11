import { FSPersister, IPersister, KeyValue, Repository, Strings } from 'tsbase';
import { FileSystemAdapter } from '../fileSystem/fileSystemAdapter';
import { PathResolver } from '../fileSystem/pathResolver';
import { Settings, SettingsMap } from './settings';
import { GetConfigurationFileName } from './getConfigurationFileName';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
  GetSettingOrDefault(settingName: Settings): string | string[];
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static Instance(
    persister: IPersister = new FSPersister(
      './',
      GetConfigurationFileName(),
      'settings',
      PathResolver,
      FileSystemAdapter)
  ): ISettingsService {
    return this.instance || (this.instance = new SettingsService(persister));
  }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<KeyValue>;

  private constructor(persister: IPersister) {
    this.Repository = new Repository<KeyValue>(persister);
  }

  public GetSettingOrDefault(settingName: Settings): string | string[] {
    const setting = this.Repository.Find(s => s.key === settingName);
    return setting && (typeof setting.value === 'object' || !Strings.IsEmptyOrWhiteSpace(setting.value)) ?
      setting.value :
      SettingsMap.get(settingName) || Strings.Empty;
  }
}
