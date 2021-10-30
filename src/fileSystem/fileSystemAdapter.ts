import * as fs from 'fs';
import { IFileSystemAdapter } from 'tsbase/Persistence/Repository/Persisters/FSPersister/IFileSystemAdapter';

export const FileSystemAdapter: IFileSystemAdapter = fs;
