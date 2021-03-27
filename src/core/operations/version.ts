import { Operation } from '../commands';
import { VersionNumber } from '../constants';

export const Version: Operation = () => {
  console.log(VersionNumber);
};
