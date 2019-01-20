import { api, MakeOptions } from '@electron-forge/core';

import createProgram, { workingDir } from './util/commander';
import './util/terminate';

// eslint-disable-next-line import/prefer-default-export
export async function getMakeOptions() {
  let dir = process.cwd();
  const program = await createProgram();
  program
    .arguments('[cwd]')
    .option('--skip-package', 'Assume the app is already packaged')
    .option('-a, --arch [arch]', 'Target architecture')
    .option('-p, --platform [platform]', 'Target build platform')
    .option('--targets [targets]', 'Override your make targets for this run')
    .allowUnknownOption(true)
    .action((cwd) => { dir = workingDir(dir, cwd); })
    .parse(process.argv);

  const makeOpts: MakeOptions = {
    dir,
    interactive: true,
    skipPackage: program.skipPackage,
  };
  if (program.targets) makeOpts.overrideTargets = program.targets.split(',');
  if (program.arch) makeOpts.arch = program.arch;
  if (program.platform) makeOpts.platform = program.platform;

  return makeOpts;
}

// eslint-disable-next-line no-underscore-dangle
if (process.mainModule === module || (global as any).__LINKED_FORGE__) {
  (async () => {
    const makeOpts = await getMakeOptions();

    await api.make(makeOpts);
  })();
}
