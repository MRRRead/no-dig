
# NO-DIG AI Coding Agent Prompt — Lean Architecture

## Purpose

You are building a **lean Obsidian-to-11ty bridge**.  
SEO, schema, sitemap, performance → are handled via 11ty.

## Scope

✅ Core → parseVault()  
✅ Preprocessors → resolve wikilinks, normalize frontmatter  
✅ Adapter → prepares 11ty data → invokes Eleventy  
✅ CLI → orchestrates build

## Constraints

🚫 Do not implement SEO/meta/schema/sitemap plugins  
🚫 Do not render HTML  
🚫 Do not duplicate 11ty plugins  
🚫 Do not modify templates  

## Testing

✅ Unit tests → core  
✅ Integration tests → vault → 11ty data → 11ty output

## Conclusion

Follow lean architecture → `/docs/architecture-and-features-lean.md`.  
Avoid scope creep.  
Keep code clean and minimal.
