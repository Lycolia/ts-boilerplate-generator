import { execSync } from 'child_process';
import { MyError } from 'src/libs/core/MyError';
import { ErrorReasons } from '../../../models/ErrorReasons';
import { MyLog } from '../../core/MyLog';

const validateInstalled = () => {
  try {
    execSync('git --help');
  } catch (error) {
    return MyError.create(ErrorReasons.gitNotFound, error);
  }
};

const validateCommiting = () => {
  try {
    const configs = execSync('git config --list').toString();

    if (
      (configs.match(/user\.name=.+/) !== null) === false ||
      (configs.match(/user\.email=.+/) !== null) === false
    ) {
      return MyError.create(ErrorReasons.gitNotConfigure);
    }
  } catch (error) {
    return MyError.create(ErrorReasons.unmanagedException, error);
  }
};

/**
 * @param cloneUrl git clone url
 */
const clone = (cloneUrl: string) => {
  try {
    MyLog.info('Cloning Project...');
    execSync(`git clone ${cloneUrl}`, {
      stdio: 'ignore',
    });
  } catch (error) {
    return MyError.create(ErrorReasons.failPull, error);
  }
};

const init = (projectDest: string) => {
  MyLog.info('Initialize Git...');
  execSync(`git -C ${projectDest} init`);
  execSync(`git -C ${projectDest} add -A`);
  execSync(`git -C ${projectDest} commit -m "inital commit"`);
};

export const Git = {
  validateInstalled,
  validateCommiting,
  clone,
  init,
};