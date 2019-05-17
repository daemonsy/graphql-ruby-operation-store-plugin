# GraphQL Ruby Operation Store Plugin

**This is a WIP and it's not ready for production use**

A webpack plugin to help sync persisted queries during webpack's build lifecycle, so everytime you edit a `.graphql` file in the app, it syncs the latest queries to your development server.

## What this does

```sh
# with NPM
npm install webpack-virtual-modules --save-dev

# with Yarn
yarn add webpack-virtual-modules --dev
```

```javascript
// In your Webpack configuration
const OperationStorePlugin = require('operation-store-plugin');
const VirtualModulesPlugin = require('virtual-modules-plugin');

const virtualModules = new VirtualModulesPlugin();

plugins = [
  virtualModules, // FIXME: Must be a better way of doing this
  new OperationStorePlugin(virtualModules, graphqlRubySyncOptions)
]
```

During the build process, it generates a virtual module that can be included.

```javascript
import OperationStore from 'graphql-ruby-operation-store';
```

Whenever a `.graphql` file changes, it will sync the queries again and generate a new operation store module. Since this avoids writing the module to disk, it avoids the complications triggering infinite loops and telling JS loaders to avoid linting or transpiling the file.

It also generates a JSON file with all the operations and digests in the project root, so you can check them in for reference.

## Why do it this way? Paint points using Persisted Queries
For `graphql-pro` users who are using persisted queries with a frontend built by Webpack, the typical setup is to allow string queries in development and then sync the queries to the production backend in some build step.

There are a couple of issues with this approach.

### A orchestration step is required in CI?
The `operation-store.js` has to be consumed by the webpack build process. Since these queries are to be synced with production, it probably has to be done in a process that can safeguard production secrets, such as a CI process right before deploy (you probably don't want to sync to production on every build).

If you combine this with running string queries in development, this means that the **last pre-production CI run might be the first time** invoking GraphQL Pro's sync script.

This can result in failures from bad naming of operations etc that might not be flagged out. Ideally we'd like a way where we can run persisted queries in both development and production.

### What about staging environments and QA?
In order to make your client work with the server, the staging / QA instance of your GraphQL server must have all the persisted queries operations seeded. This means seeding them over from production? In an active app, the DB might grow to be too large for seeding. If we only care about the latest queries for a client, do we run the sync task when deploying staging?That couples the deploy of one app to another one.

As a compromise, it should be ok to have the latest queries, automatically seeded during the deploy process **of the server**.

## Potential Solution
- In development, persisted queries are used.
- The client syncs with the development server on every graphql query change.
- The graphql server writes the latest queries to disk during sync
- Check in queries
- When the code goes into production, part of the build process adds the latest queries to the production DB

### Pros
- Same process in dev and production
- Full code transparency to see what are the latest queries for each client
- Write tests against checked in queries. E.g. Every query checked in is valid against the schema
- Checked in queries can be used directly as a request spec
- When building a staging environment for the graphql server, the checked in queries can be used as seeds
- As part of build, you can verify that the manifest on the client is the same as the server's
- One less endpoint and secret to* orchestrate in production
- Queries are only added to the production operation store on **successful** deploys

### Cons
- Devs must run the graphql server locally
- Must educate developers to check in queries


## Before Primetime
- [ ] Internalize `virtual-modules` dependency. Now you have to explicitly set it up.
- [ ] Make it generic enough to work for all clients
- [ ] More sensible default paths
- [ ] Make the Ruby code a part of the package too
- [ ] Document env variables or drop them
- [ ] Verify node LTS compat
- [ ] Tests :smirk:
