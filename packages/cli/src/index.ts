// Phase 1: Minimal CLI
// Implements `no-dig build` command to run the content pipeline

const { transformContent } = require('@no-dig/core');
const fs = require('fs');
const path = require('path');

function buildCommand(sourceDir, outDir) {
  // TODO: Read markdown files from sourceDir
  // TODO: Run transformContent on each file
  // TODO: Write output to outDir
  console.log('Building site from', sourceDir, 'to', outDir);
}

// TODO: Parse CLI args and call buildCommand

module.exports = {
  buildCommand,
};
