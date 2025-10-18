# Acolyte Time - Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Git
- GitHub account

## Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

3. **Build for production**:
```bash
npm run build
```

4. **Preview production build**:
```bash
npm run preview
```

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to GitHub and create a new repository named `acolyte-time`
2. **Do not** initialize with README, gitignore, or license

### Step 2: Initialize Git and Push

```bash
git init
git add .
git commit -m "Initial commit: Acolyte Time PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/acolyte-time.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select: **GitHub Actions**

### Step 4: Automatic Deployment

The GitHub Actions workflow is already configured in `.github/workflows/deploy.yml`.

Every time you push to the `main` branch, it will automatically:
- Build the application
- Deploy to GitHub Pages

Your app will be available at:
`https://YOUR_USERNAME.github.io/acolyte-time/`

## Generate PWA Icons

Before deployment, generate proper PWA icons:

1. Open `generate-icons.html` in your web browser
2. Click "Download 192x192" and "Download 512x512"
3. Replace the placeholder files in the `public/` directory with the downloaded files
4. Commit and push the changes

## Customize for Your Domain

If you want to use a custom domain:

1. In `vite.config.ts`, change:
```ts
base: './/'  // For GitHub Pages
```
to:
```ts
base: '/'  // For custom domain
```

2. Add a `CNAME` file in the `public/` directory with your domain name

3. Configure your domain's DNS settings as per GitHub's instructions

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### GitHub Actions Fails
- Check the Actions tab in your repository for error logs
- Ensure GitHub Pages is enabled in repository settings
- Verify the workflow file is in `.github/workflows/deploy.yml`

### PWA Not Installing
- Ensure you're using HTTPS (GitHub Pages provides this automatically)
- Check that `manifest.json` and `sw.js` are in the `public/` directory
- Clear browser cache and try again

## Local HTTPS Testing

To test PWA features locally with HTTPS:

```bash
npm install -D @vitejs/plugin-basic-ssl
```

Add to `vite.config.ts`:
```ts
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  // ...
})
```

Then run: `npm run dev -- --https`

## Environment Variables

If you need environment variables:

1. Create `.env` file (already in .gitignore)
2. Add variables with `VITE_` prefix:
```
VITE_API_URL=https://api.example.com
```

3. Access in code:
```ts
const apiUrl = import.meta.env.VITE_API_URL
```

## Production Optimization

The build is already optimized, but for further improvements:

1. **Analyze bundle size**:
```bash
npm run build -- --mode analyze
```

2. **Enable gzip compression** (usually done by hosting provider)

3. **Add caching headers** (configured in GitHub Pages automatically)

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Backup Data
Users should regularly export their data using the Export feature in the app. Consider adding a reminder in the UI.

## Support

For issues or questions:
- Check the README.md
- Open an issue on GitHub
- Review the code documentation

---

Made with precision for professionals ⏱✨
