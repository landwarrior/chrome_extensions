document.addEventListener('DOMContentLoaded', function () {
    // 保存された単語リストを表示
    showKeywords();

    // 追加ボタンのイベントリスナー
    document.getElementById('add').addEventListener('click', function () {
        const keyword = document.getElementById('keyword').value.trim();
        if (keyword) {
            // 既存のキーワードを取得して新しいキーワードを追加
            chrome.storage.local.get(['keywords'], function (result) {
                const keywords = result.keywords || [];
                if (!keywords.includes(keyword)) {
                    keywords.push(keyword);
                    chrome.storage.local.set({ keywords: keywords }, function () {
                        document.getElementById('keyword').value = '';
                        showKeywords();
                        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            if (tabs[0]) {
                                chrome.tabs.sendMessage(tabs[0].id, { action: 'setItemBackgroundColor' }).catch((error) => {
                                    console.log('メッセージの送信に失敗しました:', error);
                                });
                            }
                        });
                    });
                }
            });
        }
    });
});

/**
 * 保存された単語リストを表示する関数
 */
function showKeywords() {
    const listDiv = document.getElementById('keywordList');
    chrome.storage.local.get(['keywords'], function (result) {
        const keywords = result.keywords || [];
        listDiv.innerHTML = '<h4>登録済みの単語:</h4>';
        keywords.forEach((keyword) => {
            const div = document.createElement('div');
            div.textContent = keyword;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.style.marginLeft = '10px';
            deleteBtn.onclick = function () {
                deleteKeyword(keyword);
            };
            div.appendChild(deleteBtn);
            listDiv.appendChild(div);
        });
    });
}

/**
 * キーワードを削除する関数
 * @param {string} keyword 削除するキーワード
 */
function deleteKeyword(keyword) {
    chrome.storage.local.get(['keywords'], function (result) {
        const keywords = result.keywords || [];
        const newKeywords = keywords.filter((k) => k !== keyword);
        chrome.storage.local.set({ keywords: newKeywords }, function () {
            showKeywords();
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'setItemBackgroundColor' }).catch((error) => {
                        console.log('メッセージの送信に失敗しました:', error);
                    });
                }
            });
        });
    });
}
