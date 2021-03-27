import { ConfigurationFileName } from '../core/constants';
import { FSPersister, IPersister, KeyValue, Repository, Strings } from 'tsbase';
import { FileSystemAdapter } from './fileSystemAdapter';
import { PathResolver } from './pathResolver';
import { Settings, SettingsMap } from './settings';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
  GetSettingOrDefault(settingName: Settings): string | string[];
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static Instance(
    persister: IPersister | null = null
  ): ISettingsService {
    return this.instance || (this.instance = new SettingsService(persister));
  }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<KeyValue>;

  private constructor(persister: IPersister | null = null) {
    persister = persister || new FSPersister(
      './',
      `./${ConfigurationFileName}`,
      'settings',
      PathResolver,
      FileSystemAdapter);

    this.Repository = new Repository<KeyValue>(persister);
  }


  public GetSettingOrDefault(settingName: Settings): string | string[] {
    const setting = this.Repository.Find(s => s.key === settingName);
    return setting && (typeof setting.value === 'object' || !Strings.IsEmptyOrWhiteSpace(setting.value)) ?
      setting.value :
      SettingsMap.get(settingName) || Strings.Empty;
  }
}
