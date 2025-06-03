// @no-dig/core/src/PluginHost.test.js
const PluginHost = require('./PluginHost');

describe('PluginHost', () => {
  const makePlugin = (name, hooks = {}) => ({ name, ...hooks });
  const context = { foo: 'bar' };

  it('calls onBuildStart on all plugins', async () => {
    const calls = [];
    const plugins = [
      makePlugin('a', { onBuildStart: ctx => calls.push(['a', ctx]) }),
      makePlugin('b', { onBuildStart: ctx => calls.push(['b', ctx]) })
    ];
    const host = new PluginHost(plugins);
    await host.runHook('onBuildStart', context);
    expect(calls).toEqual([
      ['a', context],
      ['b', context]
    ]);
  });

  it('calls onVaultParsed on all plugins', async () => {
    const calls = [];
    const plugins = [
      makePlugin('a', { onVaultParsed: ctx => calls.push(['a', ctx]) }),
      makePlugin('b', { onVaultParsed: ctx => calls.push(['b', ctx]) })
    ];
    const host = new PluginHost(plugins);
    await host.runHook('onVaultParsed', context);
    expect(calls).toEqual([
      ['a', context],
      ['b', context]
    ]);
  });

  it('calls onPageGenerated on all plugins', async () => {
    const calls = [];
    const plugins = [
      makePlugin('a', { onPageGenerated: ctx => calls.push(['a', ctx]) }),
      makePlugin('b', { onPageGenerated: ctx => calls.push(['b', ctx]) })
    ];
    const host = new PluginHost(plugins);
    await host.runHook('onPageGenerated', context);
    expect(calls).toEqual([
      ['a', context],
      ['b', context]
    ]);
  });

  it('calls onBuildEnd on all plugins', async () => {
    const calls = [];
    const plugins = [
      makePlugin('a', { onBuildEnd: ctx => calls.push(['a', ctx]) }),
      makePlugin('b', { onBuildEnd: ctx => calls.push(['b', ctx]) })
    ];
    const host = new PluginHost(plugins);
    await host.runHook('onBuildEnd', context);
    expect(calls).toEqual([
      ['a', context],
      ['b', context]
    ]);
  });

  it('skips plugins without the hook', async () => {
    const calls = [];
    const plugins = [
      makePlugin('a', { onBuildStart: ctx => calls.push(['a', ctx]) }),
      makePlugin('b', {})
    ];
    const host = new PluginHost(plugins);
    await host.runHook('onBuildStart', context);
    expect(calls).toEqual([
      ['a', context]
    ]);
  });
});
