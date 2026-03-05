const { globSync } = require('glob');
const fs = require('fs');
const babel = require('@babel/core');

const projectRoot = '..';

// Find all js and jsx files in Backend and Frontend
const files = globSync([`${projectRoot}/Backend/**/*.js`, `${projectRoot}/Frontend/**/*.js`, `${projectRoot}/Frontend/**/*.jsx`], {
    ignore: ['**/node_modules/**', '**/comment-stripper/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${files.length} files to process.`);

let processed = 0;
let errors = 0;

for (const file of files) {
    try {
        const code = fs.readFileSync(file, 'utf8');

        // Parse and generate code without comments using babel
        const result = babel.transformSync(code, {
            ast: false,
            comments: false,
            retainLines: true,          // Try to retain the original line numbers
            presets: ['@babel/preset-react'],
            filename: file,             // Helps babel know how to parse if needed
        });

        if (result && result.code != null) {
            // Write the modified code back
            fs.writeFileSync(file, result.code, 'utf8');
            processed++;
        }
    } catch (err) {
        console.error(`Error processing file ${file}:`, err.message);
        errors++;
    }
}

console.log(`Done processing. Processed: ${processed}, Errors: ${errors}`);
