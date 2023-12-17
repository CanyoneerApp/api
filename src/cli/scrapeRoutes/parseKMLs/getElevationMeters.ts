import assert from 'assert';
import {isNumber} from 'lodash';
import {fetchElevationsCache} from './fetchElevationsCache';
import {id2str} from './id2str';
import {lat2tile, lon2tile} from './lon2tile';

export async function getElevationMeters([lon, lat]: number[]) {
  assert(isNumber(lon) && isNumber(lat));

  const z = 12;
  const x = lon2tile(lon, z);
  const y = lat2tile(lat, z);

  const png = await fetchElevationsCache.fetch(id2str({z: z, x: Math.floor(x), y: Math.floor(y)}));

  assert(png);

  const tileX = Math.floor((x - Math.floor(x)) * png.width);
  const tileY = Math.floor((y - Math.floor(y)) * png.height);

  const elevation = png.data[tileX * png.width + tileY];

  assert(isNumber(elevation));

  return elevation;
}