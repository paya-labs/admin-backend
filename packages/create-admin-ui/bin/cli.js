#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../template');

/**
 * Copy directory recursively
 * @param {string} src
 * @param {string} dest
 */
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Replace placeholders in file
 * @param {string} filePath
 * @param {Record<string, string>} replacements
 */
function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(key, 'g'), value);
    }
    fs.writeFileSync(filePath, content);
}

/**
 * Convert project name to valid identifiers
 * @param {string} name
 */
function toIdentifier(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Convert to PascalCase
 * @param {string} name
 */
function toPascalCase(name) {
    return name
        .split(/[-_\s]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

// Main
const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
    console.error('\x1b[31mError: Please provide a project name\x1b[0m');
    console.log('\nUsage: npx create-admin-ui <project-name>');
    console.log('\nExample:');
    console.log('  npx create-admin-ui my-client-admin');
    process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
const identifier = toIdentifier(projectName);
const pascalName = toPascalCase(projectName);

// Check if directory exists
if (fs.existsSync(targetDir)) {
    console.error(
        `\x1b[31mError: Directory "${projectName}" already exists\x1b[0m`,
    );
    process.exit(1);
}

console.log(`\nCreating project in ${targetDir}...\n`);

// Copy template
copyDir(TEMPLATE_DIR, targetDir);

// Rename gitignore to .gitignore (npm publish ignores .gitignore files)
const gitignoreSrc = path.join(targetDir, 'gitignore');
if (fs.existsSync(gitignoreSrc)) {
    fs.renameSync(gitignoreSrc, path.join(targetDir, '.gitignore'));
}

// Replace placeholders
const filesToProcess = [
    'package.json',
    'index.html',
    'src/module.config.js',
    'README.md',
];

const replacements = {
    '{{PROJECT_NAME}}': projectName,
    '{{PROJECT_IDENTIFIER}}': identifier,
    '{{PROJECT_PASCAL}}': pascalName,
};

for (const file of filesToProcess) {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
        replaceInFile(filePath, replacements);
    }
}

console.log('\x1b[32mProject created successfully!\x1b[0m\n');
console.log('Next steps:\n');
console.log(`  cd ${projectName}`);
console.log('  npm install');
console.log('  npm run dev\n');
console.log('To build for production:\n');
console.log('  npm run build\n');
