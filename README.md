# Let's Encode!

> Crowd-encoding the world's music scores, one note at a time.

**Let's Encode!** is a citizen-science project for crowd-based encoding and
validation of music scores in the [MEI](https://music-encoding.org) (Music
Encoding Initiative) format. It builds infrastructure around
[mei-friend](https://mei-friend.mdw.ac.at), a free, browser-based music encoding
editor, so that anyone can help turn sheet music into rich, machine-readable
encodings — no specialist training required.

This repository contains the project's landing page, served at
**[letsenco.de](https://letsenco.de)**.

## About the project

Digital scores are essential to both performance and musicology, but standard
PDFs and scans can't easily be processed by computers: the musical *semantics*
stay hidden from machines. Let's Encode! lowers the barrier to encoding that
meaning by hand, as a crowd:

- **Free and open source** — no fees; our software is openly licensed, and
  contributors choose how their encodings are shared (open, reuse-friendly
  licences recommended).
- **Nothing to install** — the tools run entirely in the browser, on whatever
  device you already have.
- **User-directed campaigns** — contributors can *start and manage* their own
  encoding campaigns from the browser, not just take part in someone else's.

### Goals

Early collaborations explore making semantic music-encoding accessible to
diverse communities:

- **Chamber orchestras** encoding performance scores of public-domain works.
- **Music societies** preserving cultural heritage — lute-music archives,
  klezmer collections, and the work of underrepresented composers.
- **RISM users** creating melodic incipits for the Répertoire International des
  Sources Musicales.

## Team

- **David M. Weigl** (P.I.) — Department of Music Acoustics – Wiener Klangstil, mdw
- **Julia Jaklin** (Research Associate) — Department of Music Acoustics – Wiener Klangstil, mdw
- PhD researcher — starting September 2026
- PhD researcher — starting April 2027

**Project partners:** Dagmar Abfalter (Cultural Management & Gender Studies,
mdw), Michael Staudinger (University Library, mdw), Werner Goebl (IWK, mdw).

**Advisory board:** Anna E. Kijas (Tufts University), Christina Crowder & Clara
Byom (Klezmer Institute), David Lewis (Oxford e-Research Centre & Goldsmiths),
Laurent Pugin (RISM Digital Center).

## Funding

Funded by the Austrian Science Fund (FWF), project number
[PAT 2277625](https://doi.org/10.55776/PAT2277625), running May 2026 – 2030.

## Repository layout

| File / folder            | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `index.html`             | The single-page site.                                |
| `styles.css`             | All styling.                                         |
| `lets-encode-logo.js`    | Driver for the inline animated logo in the hero.     |
| `assets/`                | Favicons and institution logos.                      |
| `favicon-preview.html`   | Dev helper for previewing favicons.                  |
| `CNAME`                  | Custom domain for GitHub Pages (`letsenco.de`).      |

The site is static — open `index.html` in a browser, or serve the directory with
any static file server. It deploys via GitHub Pages.

## Links

- Project page — <https://iwk.mdw.ac.at/lets-encode>
- mei-friend editor — <https://mei-friend.mdw.ac.at>
- Imprint — <https://iwk.mdw.ac.at/impressum/>
