# AI Prompting Guide for NO-DIG Development

This guide provides specific instructions for leveraging AI tools (Manus, ChatGPT, GitHub Copilot) effectively during the development of NO-DIG. Following these guidelines will ensure consistent, high-quality AI assistance throughout the project lifecycle.

## Available AI Tools

As a developer working on NO-DIG, you have access to:

1. **Manus** - For complex, multi-step reasoning tasks
2. **ChatGPT** - For content generation and ideation
3. **GitHub Copilot** - For in-editor code assistance in VSCode

## General AI Prompting Strategy

For all AI interactions, follow these principles:

1. **Provide Context**: Always include information about:
   - The NO-DIG project and its business website focus
   - The current development phase
   - The specific task you're working on
   - Any relevant constraints or requirements

2. **Use the Expert System Prompt**: Begin interactions with the Web Development Expert System Prompt (see [[roadmap/expert-system-prompt]]) to establish the appropriate expertise level.

3. **Be Specific**: Request concrete implementations rather than general advice.

4. **Iterate**: Use follow-up questions to refine and improve initial responses.

5. **Verify**: Always review and test AI-generated code before implementation.

## Tool-Specific Guidance

### Using Manus

Manus excels at complex reasoning tasks and multi-step problem-solving. Use it for:

- Architecture decisions
- Implementation strategies
- Debugging complex issues
- Performance optimization
- Security analysis

**Example Prompt Structure for Manus:**

```
[Insert Web Development Expert System Prompt]

I'm working on NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

Current phase: [Phase X - Name]
Current task: [Specific task description]

Current implementation:
```
[Code or description of current implementation]
```

I need help with [specific problem or question].

Please provide:
1. A detailed analysis of the problem
2. A step-by-step implementation strategy
3. Code examples for key components
4. Potential edge cases to consider
5. Testing strategies
```

### Using ChatGPT

ChatGPT is ideal for content generation, documentation, and ideation. Use it for:

- Documentation writing
- README updates
- Error message crafting
- Configuration examples
- User guide creation

**Example Prompt Structure for ChatGPT:**

```
[Insert Web Development Expert System Prompt]

I'm working on NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

Current phase: [Phase X - Name]
Current task: [Specific task description]

I need help creating [specific content]. The content should:
1. Be technically accurate
2. Follow best practices for [relevant area]
3. Be clear and concise
4. Include examples where appropriate
5. Target [specific audience]

Additional context:
[Any relevant details about the content requirements]
```

### Using GitHub Copilot in VSCode

GitHub Copilot provides in-editor code assistance. To get the most out of it:

1. **Write Detailed Comments**: Before coding, write comprehensive comments describing what you want to implement.

2. **Use TODO Comments**: Specific TODO comments help Copilot understand what you need.

3. **Provide Type Information**: Include type annotations to guide Copilot's suggestions.

4. **Iterate on Suggestions**: If the first suggestion isn't ideal, keep typing or use Alt+] to see alternatives.

**Example Comment Structure for Copilot:**

```javascript
/**
 * Processes Obsidian wikilinks in markdown content
 * 
 * This function should:
 * 1. Find all wikilinks using regex pattern [[...]]
 * 2. Handle aliases with pipe syntax [[Page|Alias]]
 * 3. Convert spaces to hyphens in URLs
 * 4. Properly encode special characters
 * 5. Return the processed content with HTML links
 * 
 * @param {string} content - The markdown content with wikilinks
 * @param {Object} options - Processing options
 * @param {boolean} options.preserveCase - Whether to preserve case in URLs
 * @returns {string} Processed content with HTML links
 */
function processWikilinks(content, options = {}) {
  // Copilot will suggest implementation here
}
```

## Phase-Specific Prompting

Each development phase has specific focus areas. Adjust your prompts accordingly:

### Phase 0: Project Scaffold & Tooling

Focus on:
- Monorepo structure
- Build system configuration
- Development environment setup
- CI/CD pipeline

**Example Phase 0 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 0 (Project Scaffold & Tooling) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help setting up [specific tooling component] with a focus on:
1. Clean architecture principles
2. Developer experience
3. Maintainability
4. Performance

Please provide a detailed implementation approach with code examples.
```

### Phase 1: MVP Content Pipeline

Focus on:
- Obsidian parsing
- Markdown transformation
- Wikilink processing
- Basic templating

**Example Phase 1 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 1 (MVP Content Pipeline) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help implementing [specific pipeline component] that can:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

Current implementation:
```
[Code or description]
```

Please provide an optimized implementation with error handling and tests.
```

### Phase 2: SEO & Performance Hardening

Focus on:
- Structured data generation
- SEO metadata management
- Core Web Vitals optimization
- Image processing

**Example Phase 2 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 2 (SEO & Performance Hardening) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help implementing [specific SEO feature] that:
1. Follows latest schema.org best practices
2. Optimizes for search engine visibility
3. Maintains performance targets
4. Handles edge cases gracefully

Please provide a detailed implementation with examples of the generated output.
```

### Phase 3: Feature Completeness

Focus on:
- Contact form implementation
- Component system
- Analytics integration
- Navigation management

**Example Phase 3 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 3 (Feature Completeness) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help designing a [specific feature] system that:
1. Is flexible and extensible
2. Follows privacy best practices
3. Integrates with the existing architecture
4. Provides a good developer experience

Please provide a detailed design and implementation approach.
```

### Phase 4: Scalability & UX Enhancements

Focus on:
- Pagination implementation
- Search functionality
- Internationalization
- User experience improvements

**Example Phase 4 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 4 (Scalability & UX Enhancements) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help implementing [specific scalability feature] that can:
1. Handle large content collections efficiently
2. Maintain performance under load
3. Provide a good user experience
4. Follow best practices for [specific area]

Please provide a detailed implementation approach with performance considerations.
```

### Phase 5: Pre-Release Polishing & Observability

Focus on:
- Error tracking
- Performance monitoring
- Accessibility improvements
- Final audits

**Example Phase 5 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 5 (Pre-Release Polishing & Observability) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help implementing [specific observability feature] that:
1. Provides actionable insights
2. Has minimal performance impact
3. Respects user privacy
4. Integrates with the existing architecture

Please provide a detailed implementation approach with examples.
```

### Phase 6: Maintenance & Iteration

Focus on:
- Bug fixes
- Performance improvements
- Feature enhancements
- Future planning

**Example Phase 6 Prompt:**
```
[Insert Web Development Expert System Prompt]

I'm working on Phase 6 (Maintenance & Iteration) of NO-DIG, an SEO-first static site generator that transforms Obsidian vaults into business-ready websites.

I need help [fixing/improving/enhancing] [specific component] to:
1. [Specific goal 1]
2. [Specific goal 2]
3. [Specific goal 3]

Current implementation:
```
[Code or description]
```

Please provide an optimized solution that maintains compatibility with existing code.
```

## Evaluating AI Responses

Always evaluate AI-generated content and code against these criteria:

1. **Correctness**: Does it solve the problem accurately?
2. **Performance**: Is it optimized for speed and resource usage?
3. **Maintainability**: Is it clean, well-structured, and documented?
4. **Security**: Are there any potential security issues?
5. **Compatibility**: Does it work with the existing codebase?
6. **Edge Cases**: Does it handle unusual inputs or scenarios?

## Conclusion

By following these AI prompting guidelines, you can leverage AI tools effectively throughout the NO-DIG development process. Remember that AI is a collaborative tool—your expertise and judgment remain essential for producing high-quality code and documentation.
