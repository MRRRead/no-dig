// @no-dig/core/src/PluginHost.js
class PluginHost {
  constructor(plugins = []) {
    this.plugins = plugins;
  }

  async runHook(hookName, context) {
    for (const plugin of this.plugins) {
      if (typeof plugin[hookName] === 'function') {
        await plugin[hookName](context);
      }
    }
  }
}

module.exports = PluginHost;
