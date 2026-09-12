import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distPath = path.resolve(projectRoot, 'dist');
const systemId = 'bardamigo';

let dataPath = null;
const configPath = path.resolve(projectRoot, 'foundryconfig.json');

if (fs.existsSync(configPath)) {
  try {
    const config = fs.readJsonSync(configPath);
    if (config.dataPath) {
      dataPath = config.dataPath;
    }
  } catch (err) {
    console.error(`Error reading foundryconfig.json: ${err.message}`);
  }
}

// Fallback to default Foundry VTT data locations if not specified
if (!dataPath) {
  const home = os.homedir();
  if (process.platform === 'linux') {
    dataPath = path.join(home, '.local/share/FoundryVTT/Data');
  } else if (process.platform === 'darwin') {
    dataPath = path.join(home, 'Library/Application Support/FoundryVTT/Data');
  } else if (process.platform === 'win32') {
    dataPath = path.join(process.env.LOCALAPPDATA || path.join(home, 'AppData/Local'), 'FoundryVTT/Data');
  }
}

if (!dataPath || !fs.existsSync(dataPath)) {
  console.warn(`\n[BarDaMIgo] Foundry data directory not found at: ${dataPath}`);
  console.warn(`Please create 'foundryconfig.json' with your Foundry data directory path:`);
  console.warn(`{\n  "dataPath": "/path/to/your/FoundryVTT/Data"\n}\n`);
  process.exit(0);
}

const systemsDir = path.join(dataPath, 'systems');
fs.ensureDirSync(systemsDir);

const targetLinkPath = path.join(systemsDir, systemId);

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
  console.log(`[BarDaMIgo] 'dist' folder not found. Building first...`);
  fs.ensureDirSync(distPath);
}

try {
  if (fs.existsSync(targetLinkPath)) {
    const stat = fs.lstatSync(targetLinkPath);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(targetLinkPath);
    } else {
      console.error(`[BarDaMIgo] Target directory ${targetLinkPath} already exists and is not a symlink. Please remove or rename it.`);
      process.exit(1);
    }
  }

  fs.symlinkSync(distPath, targetLinkPath, 'junction');
  console.log(`\n[BarDaMIgo] Successfully linked:`);
  console.log(`  Source: ${distPath}`);
  console.log(`  Target: ${targetLinkPath}\n`);
} catch (err) {
  console.error(`[BarDaMIgo] Failed to create symlink: ${err.message}`);
}
