// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
// In a real scenario we might use a dedicated library or regex.
// Since 'markdown-table-formatter' is hypothetical or hard to bundle without build,
// we will implement a simple formatter logic here for demonstration and standalone capability.

function formatTable(tableString) {
    const lines = tableString.trim().split('\n');
    const rows = lines.map(line => line.split('|').map(cell => cell.trim()).filter((cell, i) => i !== 0 && i !== line.split('|').length - 1 || cell));

    // Clean up rows to handle inner data
    // Simplified: standard MD tables have pipes at start/end

    // Let's go with a regex approach to find tables and pipe-align them.
    // This is a naive implementation for the sake of the example.
    return tableString; // Placeholder if complexity gets too high for regex-only
}

// Robust custom simple table helper
function alignMarkdownTables(content) {
    // Regex to capture tables is complex. 
    // We will look for blocks that look like tables:
    // | Header | Header |
    // | ------ | ------ |

    // For this action, let's assume valid tables and just pad them.
    // Finding tables:
    const lines = content.split('\n');
    let insideTable = false;
    let tableBuffer = [];
    let newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Check if line looks like a table row: starts and ends with |
        if (line.startsWith('|') && line.endsWith('|')) {
            insideTable = true;
            tableBuffer.push(line);
        } else {
            if (insideTable) {
                // End of table, process buffer
                newLines.push(prettifyTable(tableBuffer));
                tableBuffer = [];
                insideTable = false;
            }
            newLines.push(lines[i]); // Push current non-table line
        }
    }

    // If EOF and still inside table
    if (insideTable) {
        newLines.push(prettifyTable(tableBuffer));
    }

    return newLines.join('\n');
}

function prettifyTable(rows) {
    // 1. Parse into matrix
    const matrix = rows.map(r => r.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1));

    if (matrix.length < 2) return rows.join('\n'); // Not enough rows

    // 2. Calculate max widths
    const colWidths = [];
    const colCount = matrix[0].length;

    for (let c = 0; c < colCount; c++) {
        let max = 0;
        for (let r = 0; r < matrix.length; r++) {
            // Skip separator row for width calc usually, but we need to ensure it fits valid separators
            if (matrix[r][c] && matrix[r][c].match(/^-+$/)) continue;
            if (matrix[r][c]) max = Math.max(max, matrix[r][c].length);
        }
        // Ensure at least 3 chars for '---'
        colWidths[c] = Math.max(max, 3);
    }

    // 3. Reconstruct
    return matrix.map((row, rIdx) => {
        const isSeparator = row[0] && row[0].match(/^-+$/);
        const cells = row.map((cell, cIdx) => {
            const width = colWidths[cIdx] || 0;
            if (isSeparator) {
                return '-'.repeat(width);
            }
            return cell + ' '.repeat(width - cell.length);
        });
        return `| ${cells.join(' | ')} |`;
    }).join('\n');
}

async function run() {
    try {
        const token = core.getInput('token');
        const commitMessage = core.getInput('commit_message');
        const filePattern = core.getInput('files');

        console.log(`Scanning for markdown files: ${filePattern}`);

        glob(filePattern, { ignore: 'node_modules/**' }, async (err, files) => {
            if (err) {
                core.setFailed(err.message);
                return;
            }

            let changedCount = 0;

            for (const file of files) {
                const content = fs.readFileSync(file, 'utf8');
                const newContent = alignMarkdownTables(content);

                if (content !== newContent) {
                    console.log(`Formatting: ${file}`);
                    fs.writeFileSync(file, newContent);
                    changedCount++;
                }
            }

            if (changedCount > 0) {
                console.log(`Formatted ${changedCount} files.`);
                // Here we would commit via octokit or exec git commands
                // Assuming environment has git configured or using additional logic
                console.log(`[Simulated] Committing changes with message: "${commitMessage}"`);
            } else {
                console.log('No files needed formatting.');
            }
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
