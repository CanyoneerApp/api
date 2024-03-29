import {CloudFormation} from '@aws-sdk/client-cloudformation';
import {S3} from '@aws-sdk/client-s3';
import {program} from 'commander';
import {logger} from '../utils/logger';
import {clearPublicDir} from './clearPublicDir';
import {createBuild} from './createBuild';
import {createPublicMapStyle} from './createPublicMapStyle';
import {createPublicRoutes} from './createPublicRoutes';
import {createPublicSchemas} from './createPublicSchemas';
import {createPublicStats} from './createPublicStats';
// ISSUE-102: Tippecanoe not working
// import {createPublicTiles} from './createPublicTiles';
import {scrapeRoutes} from './scrapeRoutes';
import {syncStack} from './syncStack';
import {SyncStackOutput} from './syncStack/getStackTemplate';
import {uploadBuildDir} from './uploadBuildDir';
import {zipPublicDir} from './zipPublicDir';

program.option(
  '--local',
  'run entirely locally, do not update the AWS stack or uploading files to S3',
  false,
);

program.option(
  '--verbose',
  'If true, print every HTTP request to the console. This is useful for debugging but makes the console output very noisy.',
  false,
);

program.option(
  '--region <NAME>',
  '"all" or the name a RopeWiki region to scrape (https://ropewiki.com/Regions). In development you may prefer to scrape a small number of canyons in a region such as "California."',
  'all',
);

program.option(
  '--cachePath <PATH>',
  'The path to the cache directory. This directory will be created if it does not exist. Defaults to "./cache".',
  './cache',
);

export async function main(argv: string[]) {
  program.parse(argv);
  const options = program.opts();

  logger.enableFetch = options.verbose;

  const awsRegion = 'us-west-1';
  const s3 = new S3({region: awsRegion});
  const cloudFormation = new CloudFormation({region: awsRegion});

  let stack: SyncStackOutput | undefined;
  if (!options.local) {
    stack = await logger.step(syncStack, [cloudFormation]);
  }

  await logger.step(clearPublicDir, []);
  await logger.step(createPublicSchemas, []);
  const routes = await logger.step(scrapeRoutes, [options.region, options.cachePath]);
  await logger.step(createPublicRoutes, [routes]);
  // ISSUE-102: Tippecanoe not working
  // await logger.step(createPublicTiles, []);
  const stats = await logger.step(createPublicStats, []);
  logger.outputStats(stats, [options.region]);
  await logger.step(createPublicMapStyle, [stack?.URL ?? `http://localhost:3000`]);
  await logger.step(zipPublicDir, []);
  await logger.step(createBuild, []);

  if (!options.local && stack) {
    await logger.step(uploadBuildDir, [s3, stack]);
  }

  logger.done();
}

if (require.main === module) {
  main(process.argv);
}
