import {toRouteV1} from '../types/RouteV1';
import {RouteV2} from '../types/RouteV2';
import {scrapeRoute} from './scrapeRoute';

// This integration test alerts us if our scraper starts returning different data.
// This could happen because of:
//   - a bug in our code -> fix the bug
//   - a change to RopeWiki's HTML structure -> fix our scraper
//   - a legitimate change to one of these canyon's beta -> update the snapshot by running  `yarn test --updateSnapshot`

// These canyons are chosen because they have a lot of metadata and but are unlikely to be updated frequently

describe('scrapeRoute', () => {
  it(
    'matches snapshot for Cerebus',
    async () => {
      expect(
        transform(await scrapeRoute('https://ropewiki.com/Cerberus_Canyon_(North_Fork)')),
      ).toMatchSnapshot();
    },
    60 * 1000,
  );

  it(
    'matches snapshot for Behunin',
    async () => {
      expect(transform(await scrapeRoute('https://ropewiki.com/Behunin_Canyon'))).toMatchSnapshot();
    },
    60 * 1000,
  );
});

function transform(route: RouteV2 | undefined) {
  if (!route) return undefined;
  const {GeoJSON, HTMLDescription, ...rest} = toRouteV1(route);
  return {
    HasGeoJSON: !!GeoJSON,
    HasHTMLDescription: !!HTMLDescription,
    ...rest,
  };
}
