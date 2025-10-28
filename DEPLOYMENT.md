# Deployment Guide

## What's Been Set Up

This repository is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Structure

```
act50-prototypes/
├── .github/workflows/deploy.yml  # Automated deployment workflow
├── index.html                    # Landing page listing all prototypes
├── allocation-prototype/         # Your allocation UX prototype
│   └── (React + Vite app)
└── README.md
```

## Next Steps

### 1. Enable GitHub Pages

Go to your repository settings on GitHub:
1. Navigate to: https://github.com/greenprojecttechnologies/act50-prototypes/settings/pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save the settings

### 2. Trigger the Deployment

The workflow will automatically run on every push to `main`, but you can also:
- Go to the Actions tab: https://github.com/greenprojecttechnologies/act50-prototypes/actions
- Click on "Deploy to GitHub Pages" workflow
- Click "Run workflow" to manually trigger it

### 3. Access Your Site

Once deployed (takes 2-3 minutes), your site will be available at:

**Main landing page:**
https://greenprojecttechnologies.github.io/act50-prototypes/

**Allocation prototype:**
https://greenprojecttechnologies.github.io/act50-prototypes/allocation-prototype/

## Adding More Prototypes

To add a new prototype:

1. Create a new directory at the repo root (e.g., `my-new-prototype/`)
2. Build your prototype (it should output to `dist/` when built)
3. Update `.github/workflows/deploy.yml` to include the new prototype's build steps
4. Update `index.html` to add a link to the new prototype
5. Commit and push - it will deploy automatically!

## Local Development

Each prototype can be developed independently:

```bash
cd allocation-prototype
npm install
npm run dev
```

## Troubleshooting

### Deployment fails
- Check the Actions tab for error logs
- Ensure all dependencies are in package.json
- Verify the build command works locally: `npm run build`

### 404 errors on the deployed site
- Verify the `base` path in `vite.config.ts` matches your repo structure
- Current setting: `base: '/act50-prototypes/allocation-prototype/'`

### Assets not loading
- Make sure all asset paths are relative
- Vite automatically handles this with the `base` configuration

