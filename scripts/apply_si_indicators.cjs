// Portions of this file were generated with SI assistance (see SI_USE.md)
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const PY_HEADER = "# Portions of this file were generated with SI assistance (see SI_USE.md)\n";
const TS_HEADER = "// Portions of this file were generated with SI assistance (see SI_USE.md)\n";

function updateHeader(filePath, header) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.startsWith(header.trim())) {
    return false;
  }
  const lines = content.split('\n');
  if (lines.length > 0 && (lines[0].includes('AI assistance') || lines[0].includes('SI assistance'))) {
    lines[0] = header.trim();
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  } else {
    fs.writeFileSync(filePath, header + content, 'utf8');
  }
  return true;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walkDir(fullPath, callback);
      }
    } else {
      callback(fullPath);
    }
  }
}

let pyCount = 0;
let tsCount = 0;

// 1. Pipeline python files
const pipelineDir = path.join(ROOT_DIR, 'pipeline');
if (fs.existsSync(pipelineDir)) {
  const pyFiles = fs.readdirSync(pipelineDir).filter(f => f.endsWith('.py'));
  for (const file of pyFiles) {
    const fullPath = path.join(pipelineDir, file);
    if (updateHeader(fullPath, PY_HEADER)) {
      console.log(`Updated Python: ${file}`);
      pyCount++;
    }
  }
}

// 2. Web TS/TSX files
const webSrcDir = path.join(ROOT_DIR, 'web', 'src');
if (fs.existsSync(webSrcDir)) {
  walkDir(webSrcDir, (fullPath) => {
    if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      if (updateHeader(fullPath, TS_HEADER)) {
        console.log(`Updated TS/TSX: ${path.relative(ROOT_DIR, fullPath)}`);
        tsCount++;
      }
    }
  });
}

console.log(`Updated ${pyCount} Python files and ${tsCount} TypeScript/React files.`);

// 3. Update manifest.json
const manifestPath = path.join(ROOT_DIR, 'web', 'public', 'data', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.si_assisted_generation = true;
  manifest.generator = "pipeline/*.py";
  manifest.see = "SI_USE.md";
  manifest.ai_use = "Generated with SI assistance under human domain oversight (see SI_USE.md).";
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Updated manifest.json');
}

// 4. Update per-site JSON files
const dataDir = path.join(ROOT_DIR, 'web', 'public', 'data');
if (fs.existsSync(dataDir)) {
  const siteFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== 'manifest.json');
  for (const sf of siteFiles) {
    const sPath = path.join(dataDir, sf);
    const sData = JSON.parse(fs.readFileSync(sPath, 'utf8'));
    sData.si_assisted_generation = true;
    sData.generator = "pipeline/*.py";
    sData.see = "SI_USE.md";
    sData.ai_use = "Generated with SI assistance under human domain oversight (see SI_USE.md).";
    fs.writeFileSync(sPath, JSON.stringify(sData, null, 2), 'utf8');
    console.log(`Updated ${sf}`);
  }
}

// 5. Update final_metrics.json
const metricsPath = path.join(ROOT_DIR, 'submission', 'deck_assets', 'final_metrics.json');
if (fs.existsSync(metricsPath)) {
  const mData = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
  if (mData.metadata) {
    mData.metadata.si_assisted_generation = true;
    mData.metadata.generator = "pipeline/*.py";
    mData.metadata.see = "SI_USE.md";
  }
  fs.writeFileSync(metricsPath, JSON.stringify(mData, null, 2), 'utf8');
  console.log('Updated final_metrics.json');
}
