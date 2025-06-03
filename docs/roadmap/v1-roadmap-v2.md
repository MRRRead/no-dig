
# NO-DIG v1 Roadmap — v2 (June 2025)

## Phase 1 — Foundation

✅ Implement parseVault()  
✅ Implement PluginHost (corrected hooks)  
✅ Implement adapter-11ty → prepares 11ty data → invokes 11ty  
✅ Implement CLI `no-dig build`  
✅ Implement plugin-seo  
✅ Implement plugin-sitemap  

## Phase 2 — Testing & Release Readiness

✅ Unit tests (PluginHost, parseVault)  
✅ Integration test (vault → 11ty data)  
✅ End-to-end test (vault → site)  
✅ GitHub Actions CI  

## Phase 3 — Business Optimization

✅ Structured data plugin  
✅ Privacy plugin  
✅ Business-first 11ty templates  

## Phase 4 — OSS Polish

✅ Finalize docs  
✅ Finalize CLI polish  
✅ Finalize example site  
✅ Publish v1.0 alpha  

## Design Guardrails

- NO-DIG does NOT render HTML  
- Adapter passes data → 11ty  
- Plugins operate pre-11ty  
- 11ty is the renderer  
