# Wisdom Okobah portfolio

Five-page static portfolio, built for:
https://wiseblaizer-crypto.github.io/wisdom-okobah-portfolio/

## Build and preview

Requires Node.js 24. There are no runtime or build package dependencies.

```sh
node scripts/build.mjs
node scripts/check.mjs
node scripts/preview.mjs
```

Open http://127.0.0.1:4173/wisdom-okobah-portfolio/.
Build before previewing: HTML references generated page bundles in dist/.

The build combines shared and page-specific CSS and copies only referenced assets. Original images and TTF font sources remain in the repository for editing but are excluded from the deployment. Generated dist/ files are ignored.

## Editing

- Edit the five HTML pages and assets/css component files.
- Navigation and footer markup are currently shared by convention; keep all five pages consistent.
- Use the existing WebP image variants and intrinsic dimensions when adding images.
- fonts.css references subset WOFF2 fonts. Keep the TTF originals when preparing new subsets.
- Run build and check after every edit. The checker validates internal links, fragments, metadata, image dimensions, font references, and an 8 MB production budget.
- Animations are off by default. Play/Pause controls preserve the visitor's preference locally and respect reduced motion.

## Contact enquiries

The existing Formspree endpoint is configured in contact/index.html. Custom validation starts only after JavaScript initializes; native validation remains available without it. Requests time out after 15 seconds and preserve the visitor's details on failure. WhatsApp provides an alternate route.

Browser tests used intercepted Formspree responses; no real enquiry was sent. Before launch, submit a controlled enquiry and confirm receipt in the intended inbox. Verify the endpoint is active and the destination account is correct.

## Publish to GitHub Pages

1. Review and merge the deployment-readiness pull request when ready.
2. In repository Settings → Pages → Build and deployment, select **GitHub Actions** as the source. A branch-root deployment will not generate the CSS bundles.
3. Run **Build and deploy portfolio** on main, or let a push to main trigger it.
4. The build must pass checks before the deploy job runs. Pull requests build an artifact without publishing.
5. Check all five live pages, the missing-page experience, images, links, and actual enquiry delivery.

The workflow follows GitHub's [custom Pages deployment guidance](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically). Keep the project path when changing links. If moving to a custom domain, update canonical/social URLs, sitemap, robots.txt, 404 paths, preview prefix, and checker base URL.

## Release checks

- Review the 320, 375, 768, 1024, and 1440 px layouts.
- Check keyboard navigation, expanded mobile menus, zoom, reduced motion, galleries, testimonials, and all form states.
- Check external destinations and verify case-study descriptions remain accurate.
- Inspect the live browser console/network panel and run a mobile performance audit. Local asset sizes are not a real-user Core Web Vitals measurement.
- Submit sitemap.xml through the relevant search-engine tools if desired. Project-level robots.txt is not the host-root robots.txt.
- GitHub Pages controls response headers; custom headers require a hosting layer that supports them.

## Rollback

Revert the release commit through a new reviewed commit on main, then run the workflow again. Retain the last successful Pages deployment until the new release is verified. Do not change the Pages source before the generated build workflow is ready.
