# BarDaMIgo — Foundry Virtual Tabletop System (v14)

![Foundry VTT v14](https://img.shields.io/badge/Foundry%20VTT-v14-blue)
![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20Polski-success)
![Build](https://img.shields.io/badge/Build-Vite%20%2B%20TypeScript-orange)

An elegant, classless tabletop skirmish RPG system built for **Foundry Virtual Tabletop v14** using modern `ApplicationV2` architecture and `TypeDataModel`.

---

## ⚔️ Game System Overview

**BarDaMIgo** is a simple fantasy RPG with tabletop skirmish elements. Characters are shaped by their attributes, decisions, and equipment cards rather than rigid character classes.

> *"The most important question: **'How do I want to do it?'**"*

### Core Mechanics
* **Attributes**: 4 core stats (*Siła / Strength*, *Zręczność / Agility*, *Umysł / Mind*, *Wola / Will*) with starting distribution `+3, +2, +1, +0` (advancement up to `+4`).
* **Core Roll**: `1d20 + Attribute vs Difficulty` (**10** Easy · **14** Normal · **18** Hard · **22** Heroic).
  * **Natural 20**: Critical Success.
  * **Natural 1**: Complication.
  * **Failure by 1–2**: Success with a Cost (the GM sets the price).
* **Advantage & Disadvantage**: Roll 2d20, keep highest (`2d20kh1`) or lowest (`2d20kl1`).
* **Defense & Hits**:
  * No traditional hit point pools! Characters accumulate **Hits** (*Trafienia*).
  * Base **Hit Limit = 3** (+1 if Strength is `+3`, max 5).
  * When Hits equal the Hit Limit, the character is **Downed** (*Powalony*).
* **Determination**: 1 per mission — reroll any roll OR negate 1 hit. Recharges on Long Rest.
* **Defense Rolls**: Shields, armors, and wards provide a defense die (`d4`–`d12`). On **4+**, ignore 1 hit!
* **Active Cards**: Equipment, spells, and maneuvers are slotted into active cards (Weapon, Protection, Any, and unlockable Development slots).

---

## 🌐 Bilingual Support

BarDaMIgo natively supports both **English** and **Polish**. The system language automatically adapts to your Foundry VTT user or world language setting:
* `lang/en.json` (English)
* `lang/pl.json` (Polski)

---

## 🛠️ Development & Building

### Requirements
* [Node.js](https://nodejs.org/) (v20 or newer recommended)
* [Foundry VTT](https://foundryvtt.com/) v14

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/bardamigo.git
cd bardamigo
npm install
```

### Build Scripts
* **`npm run dev`**: Starts Vite development server.
* **`npm run build`**: Compiles TypeScript, bundles SCSS, copies `public/` assets, and outputs production bundle into `dist/`.
* **`npm run watch`**: Continuous compilation on file changes.
* **`npm run link`**: Creates a symlink between `dist/` and your local Foundry VTT `Data/systems/bardamigo` folder.

---

## 🔗 Linking to Foundry VTT

1. Copy `foundryconfig.json.example` to `foundryconfig.json`:
   ```bash
   cp foundryconfig.json.example foundryconfig.json
   ```
2. Edit `foundryconfig.json` to match your local Foundry User Data path:
   ```json
   {
     "dataPath": "/home/your-user/.local/share/FoundryVTT/Data"
   }
   ```
3. Run:
   ```bash
   npm run link
   ```

---

## 🚀 GitHub Actions CI/CD Release

When you are ready to publish a new release:
1. Update `"version"` in `package.json` and `public/system.json`.
2. Commit and tag the release:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. The `.github/workflows/release.yml` action will automatically:
   * Build the bundle
   * Package `bardamigo.zip`
   * Update the manifest URLs
   * Create a GitHub Release with `system.json` and `bardamigo.zip` attached.

---

## 📄 License
MIT License.
