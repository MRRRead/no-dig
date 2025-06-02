// sync-issues.js
// Deprecated: Use the official GitHub VS Code extension for issue management.
// This script is no longer needed and can be deleted.

const fs = require('fs');
const { execSync } = require('child_process');

const issuesPath = __dirname + '/issues.json';
const raw = fs.readFileSync(issuesPath, 'utf8');
// Remove BOM if present
const cleaned = raw.replace(/^\uFEFF/, '');
const issues = JSON.parse(
  cleaned
    .split('\n')
    .filter(line => line.trim() && !line.trim().startsWith('//'))
    .join('\n')
);

// Get all open issues from GitHub
function getOpenIssues() {
  const output = execSync('gh issue list --json number,title,state,labels', { encoding: 'utf8' });
  return JSON.parse(output);
}

// Find a GitHub issue by title
function findIssueByTitle(issues, title) {
  return issues.find(issue => issue.title === title);
}

// Main sync logic
(async function syncIssues() {
  const githubIssues = getOpenIssues();

  for (const issue of issues) {
    const existing = findIssueByTitle(githubIssues, issue.title);
    if (!existing) {
      // Create new issue
      const labels = issue.labels.join(',');
      console.log(`Creating issue: ${issue.title}`);
      execSync(`gh issue create --title "${issue.title}" --body "${issue.body}" --label "${labels}"`);
    } else if (issue.labels.includes('done') && existing.state === 'OPEN') {
      // Close issue if marked done in JSON
      console.log(`Closing issue: ${issue.title}`);
      execSync(`gh issue close ${existing.number}`);
    } else {
      // Optionally update labels/body if needed
      // Not implemented for simplicity
    }
  }

  console.log('Sync complete.');
})();
