# Font sources and licenses

Inter and Cormorant Garamond are distributed under the SIL Open Font License.
The license for each family is stored in its directory and copied into the production artifact alongside the font.

The variable WOFF2 files were prepared from the official Google Fonts sources:

- https://github.com/google/fonts/tree/main/ofl/inter
- https://github.com/google/fonts/tree/main/ofl/cormorantgaramond

Inter's optical size was fixed at 18 to match the site's existing Inter 18pt faces while retaining the weight axis.
Both fonts were subset with fontTools and Brotli to Latin, Latin Extended, general punctuation, currency symbols, arrows, and dingbats. Additional writing systems require a new subset.
The original static TTF files remain as existing design sources but are not copied into the deployment.
