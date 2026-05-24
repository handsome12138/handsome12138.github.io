# Personal Homepage

This repository hosts my GitHub Pages personal homepage.

## Content

The site supports English and Chinese content. Edit the language-specific files here:

- `contents/en/config.yml`
- `contents/en/home.md`
- `contents/en/awards.md`
- `contents/en/experience.md`
- `contents/en/publications.md`
- `contents/zh/config.yml`
- `contents/zh/home.md`
- `contents/zh/awards.md`
- `contents/zh/experience.md`
- `contents/zh/publications.md`

Publication source data is kept in `publication/generate_citation.tex` and `publication/myref.bib`.

## Preview

Run a local static server from the repository root:

```powershell
python -m http.server 8980 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8980/index.html`.
