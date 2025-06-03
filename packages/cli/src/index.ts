// @ts-nocheck
// Phase 1: Minimal CLI
// Implements `no-dig build` command to run the content pipeline

const { execSync } = require('child_process');
const path = require('path');

function buildCommand(sourceDir, outDir) {
  const fs = require('fs');
  const inputDir = path.resolve(sourceDir);
  const outputDir = path.resolve(outDir);
  // Debug: List all files in inputDir before build
  const files = fs.readdirSync(inputDir);
  console.log('[buildCommand] inputDir contents before build:', files);
  // Remove any .html files in the input directory to avoid 11ty output conflicts
  files.forEach(f => {
    if (f.endsWith('.html')) {
      fs.rmSync(path.join(inputDir, f));
    }
  });
  try {
    // Run 11ty build synchronously, setting cwd to the directory with .eleventy.js
    execSync(`npx @11ty/eleventy --input="${inputDir}" --output="${outputDir}"`, {
      stdio: 'inherit',
      cwd: path.dirname(inputDir), // This is 'tmp', where .eleventy.js lives
      shell: true
    });
    // Ensure all output files are flushed to disk before returning
    // (TDD contract: output file must exist after this returns)
    const outputHtml = require('path').join(outputDir, 'content', 'index.html');
    const maxWait = 5000; // 5s max
    let waited = 0;
    while (!fs.existsSync(outputHtml) && waited < maxWait) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50); // Sleep 50ms
      waited += 50;
    }
    if (!fs.existsSync(outputHtml)) {
      throw new Error(`11ty build did not produce expected output: ${outputHtml}`);
    }
    console.log(`Built site from ${inputDir} to ${outputDir} using 11ty`);
  } catch (err) {
    console.error('11ty build failed:', err);
    process.exit(1);
  }
}

module.exports = {
  buildCommand,
};
