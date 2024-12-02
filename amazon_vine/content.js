window.addEventListener('load', function () {
    setItemBackgroundColor();
    unsetGridHeight();
});
// メッセージを受信したときの処理
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'setItemBackgroundColor') {
        // ここで関数を実行
        setItemBackgroundColor();
    }
});

/**
 * 保存された単語リストをチェックして背景色を変更
 */
function setItemBackgroundColor() {
    chrome.storage.local.get(['keywords'], function (result) {
        const keywords = result.keywords || [];
        const items = document.querySelectorAll('.vvp-item-tile');
        for (const item of items) {
            const title = item.querySelector('.a-truncate>span').textContent;
            const hasKeyword = keywords.some((keyword) => title.toLowerCase().includes(keyword.toLowerCase()));
            if (hasKeyword) {
                item.style.backgroundColor = '#c8e3c9';
            } else {
                item.style.backgroundColor = null;
            }
        }
    });
}

/**
 * 高さの上限設定を解除
 */
function unsetGridHeight() {
    const grids = document.querySelectorAll('.vvp-item-product-title-container');
    for (const grid of grids) {
        grid.style.height = 'auto';
        const spanTop = grid.querySelector('.a-truncate');
        spanTop.style.maxHeight = null;
        spanTop.children[0].classList.remove('a-offscreen', 'a-truncate-full');
        spanTop.removeChild(spanTop.children[1]);
    }
}
