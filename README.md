# Archived
*This project has been archived. Contact the owner of [Canyoneer](https://github.com/bricepollock/canyoneer) for current work.*

----------------------

This is an API for canyoneering routes from RopeWiki.

# Using the API

You can make HTTP requests to the API at `http://canyoneer--main.s3.us-west-1.amazonaws.com`.

The following endpoints are available:

- `/style.json` - a JSON file containing a Mapbox Style Spec for viewing the vector tiles
- `/v1/index.json` - all routes as a JSON array using the `RouteV1` type
- `/v1/schemas/{type}.json` - JSON schemas for `RouteV1`
- `/v2.zip` - A zip archive of the entire v2 directory
- `/v2/details/{id}.json` - detailed data for a single route using the `RouteV2` type which includes
  the HTML description and all geometries from the KML file
- `/v2/index.geojson` - all route geometries as a JSON array from the KML files using the
  `GeoJSONRouteV2` type
- `/v2/index.json` - all routes as a JSON array using the lightweight `IndexRouteV2` type
- `/v2/schemas/{type}.json` - JSON schemas for `IndexRouteV2`, `RouteV2`, and `GeoJSONRouteV2
- `/v2/tiles/{z}/{x}/{y}.pbf` - all route geometries from the KML files as the `GeoJSONRouteV2` type
  formatted as [Vector Tiles](https://github.com/mapbox/vector-tile-spec/)
- `/v2/tiles/metadata.json` - a standard Tippecanoe metadata file that describes what's in the
  vector tiles and how they were generated

All content on our API is available under
[Creative Commons Attribution Non-Commercial Share Alike](http://creativecommons.org/licenses/by-nc-sa/3.0/)
unless otherwise noted.

# Developing the API

## Getting Started

Install native dependencies

- [git](https://git-scm.com)
- [Node.js](https://nodejs.org/en) (>= v19)
- [yarn](https://yarnpkg.com/) (>= v1.22)
- pandoc (>= 3.x.x)
- [tippecanoe](https://github.com/mapbox/tippecanoe) (>= v1.36)
- [mapnik](https://github.com/mapbox/tippecanoe) (>= v1.36)

One recommendation to install these is using [brew](https://brew.sh)
```
brew install yarn
brew install pandoc
brew install tippecanoe
brew install mapnik
```

Clone this git repository

```
git clone git@github.com:lucaswoj/canyoneer.git
cd canyoneer
```

Install yarn dependencies

```
yarn
```

Install the git pre-commit hook

```
yarn install-precommit
```

[Ask existing user to create an AWS account for you](https://us-east-1.console.aws.amazon.com/singlesignon/home?region=us-east-1&userCreationOrigin=IAM#!/instances/72232ee7076fe391/users)

[Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

[Create an AWS access key](https://us-east-1.console.aws.amazon.com/iam/home#/security_credentials)
([docs](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey))

Authenticate the AWS CLI

```
$ aws configure --profile canyoneer

AWS Access Key ID [None]: {COPY FROM PREVIOUS STEP}
AWS Secret Access Key [None]: {COPY FROM PREVIOUS STEP}
Default region name [None]:
Default output format [None]:
```

Run the tests

```
yarn test
```

Run the scraper

```
yarn start
```

The scraper supports some command line flags. You can see all of them by running

```
yarn start --help
```

## Developing the Web Frontend

After running the scraper as above, you may start the web interface in development mode by running

```
yarn web
```

## Directory Layout

- `.github` configures GitHub workflows to run our unit tests on every push to provide continuous
  integration (CI).
- `.vscode` configures VSCode to work seamlessly with our code formatting tools.
- `build` contains the compiled web frontend, route JSON files, and tiles after the CLI finishes
  running. This is what gets uploaded to S3. This folder does not exist until the CLI has run.
- `cache` contains cached HTTP responses from RopeWiki. This folder does not exist until the CLI has
  run.
- `coverage` contains a unit test code coverage report. This folder does not exist until the unit
  tests have run.
- `fixtures` contains test fixtures needed for the unit tests
- `public` contains static files used by our web frontend. These files are copied to the build
  directory alongside the compiled web frontend in a later step. See the
  ["Using the Public Folder" docs](https://create-react-app.dev/docs/using-the-public-folder.) from
  Create React App for more.
- `src/cli` contains the scraper itself and a command-line interface (CLI) for running it.
- `src/types` contains TypeScript type definitions used throughout the codebase.
- `src/utils` contains utility functions and helper modules used across the codebase.
- `src/web` contains a React web frontend app for viewing the data and iterating on our the Mapbox
  style.
