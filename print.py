from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def make_print_html(input_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    for div in soup.find_all('div', class_='unit-container'):
        classes = div.get('class', [])
        if 'active' not in classes:
            classes.append('active')
        div['class'] = classes

    for div in soup.find_all('div', class_='unit-content'):
        classes = div.get('class', [])
        if 'active' not in classes:
            classes.append('active')
        div['class'] = classes

    for sel in ['.menu-floating-btn', '.menu-overlay', '.menu-panel',
                '.units-floating-btn', '.units-overlay', '.units-panel']:
        for el in soup.select(sel):
            el.decompose()

    for link in soup.find_all('link', rel='stylesheet'):
        href = link.get('href', '')
        if not href.startswith('http') and not os.path.isabs(href):
            link['href'] = os.path.abspath(href)

    style_tag = soup.new_tag('style')
    style_tag.string = """
        .unit-container, div[id^="unit"] { display: block !important; }
        .unit-content { display: flex !important; flex-direction: column; }
        .menu-floating-btn, .menu-overlay, .menu-panel,
        .units-floating-btn, .units-overlay, .units-panel { display: none !important; }
        .unit-container { page-break-before: always; }
        .unit-container:first-of-type { page-break-before: avoid; }
    """
    soup.find('head').append(style_tag)

    return str(soup)


with sync_playwright() as p:
    browser = p.chromium.launch()

    for fname in ['A1', 'A2', 'Vocabulary']:
        print(f"Procesando {fname}...")

        html_content = make_print_html(f'{fname}.html')
        temp_html = os.path.abspath(f'{fname}_print.html')

        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_content)

        page = browser.new_page()
        page.goto(f'file:///{temp_html}')
        page.wait_for_load_state('domcontentloaded')  # ← cambiado
        page.wait_for_timeout(1000)                   # ← agregado

        page.pdf(
            path=f'{fname}_all_units.pdf',
            format='A4',
            margin={'top': '1.5cm', 'bottom': '1.5cm', 'left': '1.5cm', 'right': '1.5cm'},
            print_background=True
        )

        os.remove(temp_html)
        print(f"  ✅ {fname}_all_units.pdf generado")

    browser.close()