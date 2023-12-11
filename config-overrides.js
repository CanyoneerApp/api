const Path = require('path');

// This file configures some "create-react-app" overrides via the "react-app-rewired" package.
module.exports = {
  paths: paths => ({
    ...paths,
    appIndexJs: Path.resolve('./src/web/index.tsx'),
  }),
};