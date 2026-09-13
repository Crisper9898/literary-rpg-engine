# Windows setup

## Required
1. Codex for Windows
2. Git for Windows
3. Node.js 20.19+ recommended

## Recommended
4. Visual Studio Code

## Not required
- RPG Maker
- globally installed Phaser
- Python
- Unity
- Godot

Pixi'VN, PixiJS, Vite, TypeScript, Vitest and Playwright are project dependencies and are installed with npm.

## Verify
Run in PowerShell:

```powershell
git --version
node --version
npm --version
```

Then, from the repository:

```powershell
npm install
npm run dev
```

For validation:

```powershell
npm test
npm run build
npm run test:e2e
```

Do not install Pixi'VN or PixiJS globally.
