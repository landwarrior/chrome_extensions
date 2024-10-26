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
    const elementBase = document.querySelector('div[aria-label*="検索結果"][role="feed"]');
    for (const element of elementBase.querySelectorAll('div:not([class]):not([jslog])')) {
        const anchor = element.querySelector('a');
        if (!anchor) {
            continue;
        }
        const name = anchor.getAttribute('aria-label');
        const address = anchor.href;
        results.push(`${name},${address}`);
    }
    // ここではまだCSV形式の文字列(UTF-8)
    const csvContent = results.join('\r\n');

    // Shift JISに変換
    const unicodeArray = window.Encoding.stringToCode(csvContent);
    const sjisArray = window.Encoding.convert(unicodeArray, { to: 'SJIS', from: 'UNICODE' });
    const uint8Array = new Uint8Array(sjisArray);
    const blob = new Blob([uint8Array], { type: 'text/csv' });

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'google_maps_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
