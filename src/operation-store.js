const { generateClient, sync } = require('./sync-queries');

class OperationStorePlugin {
  constructor(virtualModules, options = {}) {
    this.virtualModules = virtualModules;
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('OperationStorePlugin:sync', compilation => {
      const operationStore = generateClient(this.options);
      sync(this.options);
      this.virtualModules.writeModule('node_modules/graphql-ruby-operation-store.js', operationStore);
    });
  }
}

module.exports = OperationStorePlugin;
