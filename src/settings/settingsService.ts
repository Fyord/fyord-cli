import { FSPersister, IPersister, KeyValue, Repository, Strings } from 'tsbase';
import { FileSystemAdapter } from './FileSystemAdapter';
import { PathResolver } from './pathResolver';
import { Settings, SettingsMap } from './settings';

export interface ISettingsService {
  Repository: Repository<KeyValue>;
  GetSettingOrDefault(settingName: Settings): string | string[];
}

export class SettingsService implements ISettingsService {
  private static instance: ISettingsService | null = null;
  public static Instance(
    settingsFilePath = './fyord.json',
    persister: IPersister | null = null
  ): ISettingsService {
    return this.instance || (this.instance = new SettingsService(settingsFilePath, persister));
  }
  public static Destroy(): void { this.instance = null; }

  public Repository: Repository<KeyValue>;

  private constructor(settingsFilePath: string, persister: IPersister | null = null) {
    persister = persister || new FSPersister(
      './',
      settingsFilePath,
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
