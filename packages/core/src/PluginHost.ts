// @no-dig/core/src/PluginHost.ts
export class PluginHost {
  plugins: any[];
  constructor(plugins: any[] = []) {
    this.plugins = plugins;
  }
  async runHook(hookName: string, context: any) {
    for (const plugin of this.plugins) {
      if (typeof plugin[hookName] === 'function') {
        await plugin[hookName](context);
      }
    }
  }
}
