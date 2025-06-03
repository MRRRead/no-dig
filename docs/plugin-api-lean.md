
# NO-DIG Plugin API — Lean Scope

## Purpose

Preprocessors (if needed) operate ONLY on parsed vault content **before it is passed to 11ty**.

## Lifecycle Hooks

### onVaultParsed(context)

Runs after parsing → before adapter prepares 11ty data.

## Context

```js
{
  vaultPages: [
    { frontmatter, content, slug }
  ]
}
```

## Responsibilities

- Wikilink resolution
- Frontmatter normalization
- Optional metadata transformations

## Constraints

🚫 No HTML rendering  
🚫 No SEO/schema/sitemap logic  
🚫 No template logic  

## Conclusion

Preprocessors operate only at the vault processing stage.
