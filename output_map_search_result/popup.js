document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('export').addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: extractAndDownload,
            });
        });
    });
});

function extractAndDownload() {
    const results = [];
    if (location.href.includes('https://www.google.com/maps')) {
        const elements = document.querySelectorAll('.section-result');

        elements.forEach((element) => {
            const name = element.querySelector('.section-result-title span').innerText;
            const address = element.querySelector('.section-result-location').innerText;
            const phone = element.querySelector('.section-result-phone-number').innerText;
            results.push({ name, address, phone });
        });
    } else {
        const elementBase = document.querySelector('div[aria-label*="検索結果"][role="feed"]');

        for (const element of elementBase.querySelectorAll('div:not([class]):not([jslog])')) {
            const anchor = element.querySelector('a');
            if (!anchor) {
                continue;
            }
            const name = anchor.getAttribute('aria-label');
            const address = anchor.href;
            results.push({ name, address });
        }
    }
    const csvContent = 'data:text/csv;charset=utf-8,' + results.map((e) => `${e.name},${e.address}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'google_maps_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
