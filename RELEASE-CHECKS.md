# Deployment-readiness verification

Verified locally on 15 November 2026 against the generated production build.

## Completed

- Five pages tested at 320, 375, 768, 1024, and 1440 CSS pixels (25 combinations).
- No missing local images, broken internal links, uncaught page errors, or unintended horizontal overflow in those checks.
- axe-core WCAG 2 A/AA and WCAG 2.1 AA automated scans returned no violations on all five pages at 375 and 1440 px. Automated scans do not establish complete accessibility conformance.
- Both variable font families loaded successfully; no console errors in the final font check.
- Thirteen interaction checks passed: keyboard skip link and menu, Contact navigation, short landscape menu, carousel and case-study links, saved animation controls, reduced-motion override, empty-form rejection, failed/successful/timed-out submissions, missing-page handling, no-JavaScript navigation/native validation, and enlarged text.
- Form tests intercepted network requests. No real enquiries were sent.
- Production checker validates 333 local references, including social preview images, metadata, image dimensions, fonts, and asset budgets.
- Existing external case-study destinations and the Formspree privacy page returned HTTP 200 during verification.

## Asset results

- Five full-page project previews: 71.06 MB of originals to 2.18 MB for their largest displayed variants (approximately 97% smaller).
- Header logo: 1.10 MB PNG to approximately 12 KB WebP.
- Display fonts: 3.37 MB of static TTF sources to approximately 124 KB across two subset variable WOFF2 files.
- Complete production artifact: approximately 6.42 MB, including responsive variants, social preview imagery, and font licenses. Original source assets are excluded from deployment.

## Performance evidence and limits

A single cold-cache local run used a 375 × 812 mobile viewport, 150 ms network latency, 1.6 Mbps download throughput, 4× CPU slowdown, and reduced motion. The local server sends uncompressed text, so these results are not a production benchmark.

| Page | Local LCP | Local CLS | Initial transfer |
|---|---:|---:|---:|
| Home | 2.89 s | 0 | 345 KB |
| Services | 2.11 s | 0 | 233 KB |
| Work | 2.15 s | 0 | 257 KB |
| About | 1.80 s | 0 | 242 KB |
| Contact | 2.27 s | 0 | 258 KB |

The homepage exceeds the 2.5-second LCP target in this local run. Measure the published build with its actual caching/compression, repeat mobile lab runs, and improve further if needed. INP and real-user Core Web Vitals have not been measured.

## Before publishing

1. Review the changed pages and confirm public case-study descriptions and contact details.
2. Confirm the existing Formspree endpoint sends to the intended inbox with a controlled real enquiry.
3. Follow README.md to change the Pages publishing source to GitHub Actions and publish the generated dist/ artifact. Do not use a branch-root deployment for this source layout.
4. Recheck the live release, including missing-page handling, mobile navigation, enquiry delivery, and performance.

The preparation work does not change the live site until the release is merged and deployed.
