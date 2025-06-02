const { transformContent } = require('@no-dig/core');
const { provideContentTo11ty } = require('./index');

describe('11ty Adapter', () => {
  it('provides transformed content to 11ty', () => {
    const md = 'Hello [[World]]!';
    const transformed = transformContent(md);
    // Simulate 11ty integration: should not throw and should contain HTML link
    expect(() => provideContentTo11ty(transformed)).not.toThrow();
    expect(transformed.content).toContain('<a href="/world">World</a>');
  });
});
