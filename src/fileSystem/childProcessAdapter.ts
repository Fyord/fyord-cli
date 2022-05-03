import * as child_process from 'child_process';
import { Commands } from '../enums/module';

export type ChildProcessAdapter = typeof child_process &
{
  exec: (command: Commands, _callback: (stdErr: any) => void) => void,
  execSync: (command: Commands) => void
};
