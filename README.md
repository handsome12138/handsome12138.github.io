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

## License and Attribution

This homepage is adapted from [Yixin0313/personal-homepage-template](https://github.com/Yixin0313/personal-homepage-template), which is published under the MIT License.

Local modifications in this repository are licensed under the MIT License unless otherwise noted. See [LICENSE](LICENSE) for the full license text and [NOTICE.md](NOTICE.md) for the upstream attribution.
