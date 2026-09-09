# Portfolio website

Static HTML and CSS; no build step or external UI dependencies.

- `index.html`: two portfolios, four project slots each.
- `about.html`: professional background and contact links, based on the supplied resume.
- `styles.css`: shared responsive styles.
- `projects.js`: discovers published demos using the public GitHub repository on `main`.

## Publishing projects

The existing Carnival build stays at `demo1/index.html`. Future builds can use:

- `portfolio1/demo1/index.html` through `portfolio1/demo4/index.html`
- `portfolio2/demo1/index.html` through `portfolio2/demo4/index.html`

Legacy root folders `demo1` through `demo8` are also recognized. Nested portfolio folders take priority. The script enables corresponding cards after discovery and a successful HTTP check. Edit card titles and descriptions in `index.html` when adding projects. Static markup remains available if GitHub is unavailable or JavaScript is disabled.

Navigation and project links are relative so the site can also run below a URL prefix such as `/portfolio1/`, once the hosting Worker maps that prefix to these files.

No phone number or downloadable copy of the resume is included.
