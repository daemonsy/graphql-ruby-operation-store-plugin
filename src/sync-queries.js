const { sync, generateClient } = require('graphql-ruby-client');


const defaultOutfile = process.env.GRAPHQL_OUTFILE_PATH;
const defaultAddTypename = process.env.GRAPHQL_ADD_TYPE_NAME || true; // For Apollo client
const defaultPath = process.env.GRAPHQL_PATH;
const defaultUrl = process.env.GRAPHQL_URL;

const defaultClientSecret = process.env.GRAPHQL_SECRET;

const generateOperationStore = ({
  client,
  addTypename = defaultAddTypename,
  path = defaultPath,
  mode = 'project',
  clientType = 'js',
  verbose = false
} = {}) => {
  return generateClient({
    client,
    clientName: client, // Until https://github.com/rmosolgo/graphql-ruby/pull/2292 is closed
    clientType,
    addTypename,
    path,
    mode,
    verbose
  });
}

const syncQueries = ({
  client,
  secret = defaultClientSecret,
  addTypename = defaultAddTypename,
  path = defaultPath,
  url = defaultUrl,
  outfile = defaultOutfile,
  outfileType = 'json',
  mode = 'project',
  verbose = false
} = {}) => {
  if (!secret) {
    throw new Error('Client secret is required for syncing via HTTP');
  };

  sync({
    addTypename,
    path,
    url,
    outfile,
    outfileType,
    secret,
    client,
    mode,
    verbose
  });
}

module.exports = {
  sync: syncQueries,
  generateClient: generateOperationStore
};
