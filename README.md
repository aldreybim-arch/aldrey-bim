# Aldrey Dela Pena Canlas — Portfolio Website

Personal portfolio website for Aldrey Dela Pena Canlas, AI Engineer. Built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no build tools, no external dependencies.

## Project Structure

```
portfolio-website/
├── index.html          # Single HTML page containing all sections
├── css/
│   └── style.css       # All styles, including responsive media queries
├── js/
│   └── main.js         # All interactivity and DOM manipulation
└── README.md           # This file
```

## Local Development

No build step or package manager is required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Using Python (Python 3)
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080` in your browser.

## GitHub Pages Deployment

### Option 1: Deploy from the `main` branch root (recommended)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<username>/<repository-name>.git
   git push -u origin main
   ```

2. Go to your repository on GitHub.

3. Navigate to **Settings → Pages**.

4. Under **Source**, select **Deploy from a branch**.

5. Choose the **`main`** branch and **`/ (root)`** folder, then click **Save**.

6. GitHub Pages will build and publish the site. After a minute or two, it will be available at:
   ```
   https://<username>.github.io/<repository-name>/
   ```

### Option 2: Deploy from a `gh-pages` branch

1. Create and push a `gh-pages` branch:
   ```bash
   git checkout -b gh-pages
   git push -u origin gh-pages
   ```

2. In **Settings → Pages**, set the source branch to **`gh-pages`** and folder to **`/ (root)`**.

3. The site will be available at `https://<username>.github.io/<repository-name>/`.

## Notes

- All assets (HTML, CSS, JavaScript) are local — no external CDN dependencies.
- The site works correctly when served from a subdirectory path (e.g., `/<repository-name>/`) because all asset references use relative paths.
- No server-side processing is required; the site is fully static.
