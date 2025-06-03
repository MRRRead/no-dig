interface WikilinksPluginOptions {
  baseDir?: string;
  titleAttr?: boolean;
  interlinker?: Record<string, any>;
}

interface EleventyConfig {
  addPlugin: (plugin: any, options?: any) => void;
  addFilter: (name: string, fn: (url: string) => string) => void;
}

function slugifyUrl(input: string): string {
  return input
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9\-_\s\/]/g, '') // remove special chars except dash/underscore/space/slash
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/\/+/, '/')
    .toLowerCase();
}

export default function wikilinksPlugin(options: WikilinksPluginOptions = {}) {
  return {
    name: 'wikilinks',
    initialize({ config }: { config: EleventyConfig }) {
      let interlinker;
      try {
        interlinker = require('eleventy-plugin-interlinker');
      } catch (e) {
        throw new Error('eleventy-plugin-interlinker must be installed when using wikilinks plugin in Eleventy context.');
      }
      const interlinkerOptions = {
        baseDir: options.baseDir || 'content',
        titleAttr: options.titleAttr !== false,
        ...options.interlinker
      };
      config.addPlugin(interlinker, interlinkerOptions);
      config.addFilter('seoWikilinkUrl', (url: string) => slugifyUrl(url));
    },
    // Optionally, add transformContent for non-11ty use
    transformContent(content: string) {
      let out = content;
      // Handle image embeds
      out = out.replace(/!\[\[([^\]|]+\.(png|jpg|jpeg|gif|svg))\]\]/gi, (match, file) => {
        const src = '/' + slugifyUrl(file.trim());
        return `<img src="${src}" alt="${file}" />`;
      });
      // Handle note embeds (e.g., ![[note.md]] or ![[outer.md]])
      out = out.replace(/!\[\[([^\]|]+)\]\]/g, (match, file) => {
        const base = file.replace(/\.md$/i, '');
        const href = '/' + slugifyUrl(base);
        const text = base;
        return `<a href="${href}">${text}</a>`;
      });
      // Handle regular wikilinks (ignore ![[...]] embeds)
      out = out.replace(/(^|[^!])\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, prefix, page, _alias, alias) => {
        const text = (alias || page).trim();
        const href = slugifyUrl(page.trim());
        return `${prefix}<a href="/${href}">${text}</a>`;
      });
      return out;
    },
    // Plugin lifecycle hooks for testability
    beforeBuild(ctx: any) {
      if (typeof ctx === 'object' && ctx.calls) ctx.calls.push(`before:${ctx.content}`);
      return ctx;
    },
    afterBuild(ctx: any) {
      if (typeof ctx === 'object' && ctx.calls) ctx.calls.push(`after:${ctx.content}`);
      return ctx;
    }
  };
}
