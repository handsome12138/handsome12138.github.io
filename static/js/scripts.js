const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];
const supported_languages = ['en', 'zh'];
const default_language = 'en';
const language_storage_key = 'site-language';

const ui_text = {
    en: {
        nav: {
            home: 'HOME',
            awards: 'AWARDS',
            experience: 'EXPERIENCE',
            publications: 'PUBLICATIONS',
        },
        section: {
            awards: '<i class="bi bi-award-fill"></i>AWARDS ',
            experience: '<i class="bi bi-briefcase-fill"></i> EXPERIENCE ',
            publications: '<i class="bi bi-file-text-fill"></i>&nbsp;PUBLICATIONS',
        },
    },
    zh: {
        nav: {
            home: '主页',
            awards: '荣誉',
            experience: '经历',
            publications: '论文',
        },
        section: {
            awards: '<i class="bi bi-award-fill"></i>荣誉 ',
            experience: '<i class="bi bi-briefcase-fill"></i> 经历 ',
            publications: '<i class="bi bi-file-text-fill"></i>&nbsp;论文',
        },
    },
};

function getNestedValue(source, path) {
    return path.split('.').reduce((value, key) => value && value[key], source);
}

function getPreferredLanguage() {
    const stored_language = localStorage.getItem(language_storage_key);
    if (supported_languages.includes(stored_language)) {
        return stored_language;
    }
    return navigator.language && navigator.language.toLowerCase().startsWith('zh') ? 'zh' : default_language;
}

async function fetchTextWithFallback(lang, filename) {
    const paths = [content_dir + lang + '/' + filename];
    if (lang !== default_language) {
        paths.push(content_dir + default_language + '/' + filename);
    }

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.log(error);
        }
    }

    throw new Error('Unable to load ' + filename + ' for language ' + lang);
}

function applyUiText(lang) {
    const text = ui_text[lang] || ui_text[default_language];
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const value = getNestedValue(text, element.dataset.i18n);
        if (!value) {
            return;
        }

        if (element.dataset.i18nHtml === 'true') {
            element.innerHTML = value;
        } else {
            element.textContent = value;
        }
    });
}

function updateLanguageButtons(lang) {
    document.querySelectorAll('[data-lang]').forEach(button => {
        const is_active = button.dataset.lang === lang;
        button.classList.toggle('active', is_active);
        button.setAttribute('aria-pressed', is_active.toString());
    });
}

function typesetMath() {
    if (!window.MathJax) {
        return;
    }

    if (MathJax.typesetClear) {
        MathJax.typesetClear();
    }
    if (MathJax.typesetPromise) {
        MathJax.typesetPromise().catch(error => console.log(error));
    } else if (MathJax.typeset) {
        MathJax.typeset();
    }
}

async function loadConfig(lang) {
    const text = await fetchTextWithFallback(lang, config_file);
    const yml = jsyaml.load(text);
    Object.keys(yml).forEach(key => {
        try {
            document.getElementById(key).innerHTML = yml[key];
        } catch {
            console.log("Unknown id and value: " + key + "," + yml[key].toString())
        }
    })
}

async function loadMarkdownSections(lang) {
    await Promise.all(section_names.map(async name => {
        const markdown = await fetchTextWithFallback(lang, name + '.md');
        const html = marked.parse(markdown);
        document.getElementById(name + '-md').innerHTML = html;
    }));
}

async function loadLanguage(lang) {
    const language = supported_languages.includes(lang) ? lang : default_language;

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem(language_storage_key, language);
    applyUiText(language);
    updateLanguageButtons(language);

    await loadConfig(language);
    await loadMarkdownSections(language);
    typesetMath();
}


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    marked.use({ mangle: false, headerIds: false })

    document.querySelectorAll('[data-lang]').forEach(button => {
        button.addEventListener('click', () => {
            loadLanguage(button.dataset.lang).catch(error => console.log(error));
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    loadLanguage(getPreferredLanguage()).catch(error => console.log(error));

}); 
