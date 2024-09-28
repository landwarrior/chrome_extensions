chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes('https://www.google.co.jp/maps') || tab.url.includes('https://www.google.com/maps')) {
        chrome.action.setPopup({ tabId: tab.id, popup: 'popup.html' });
        chrome.action.openPopup();
    } else {
        chrome.action.setPopup({ tabId: tab.id, popup: '' });
    }
});
