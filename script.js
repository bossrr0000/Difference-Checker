function compareAndHighlight() {
    const div1 = document.getElementById('text1');
    const div2 = document.getElementById('text2');
    const resultDiv = document.getElementById('result');

    const rawText1 = div1.innerText;
    const rawText2 = div2.innerText;

    if (rawText1.trim() === "" && rawText2.trim() === "") {
        resultDiv.innerHTML = "Please enter content to compare.";
        resultDiv.className = "result different";
        return;
    }

    const maxLength = Math.max(rawText1.length, rawText2.length);
    let highlightedText1 = "";
    let highlightedText2 = "";
    let isSame = true;

    for (let i = 0; i < maxLength; i++) {
        let char1 = rawText1[i];
        let char2 = rawText2[i];

        if (char1 === char2) {
            if (char1 !== undefined) highlightedText1 += escapeHTML(char1);
            if (char2 !== undefined) highlightedText2 += escapeHTML(char2);
        } else {
            isSame = false;
            if (char1 !== undefined) {
                highlightedText1 += `<span class="diff">${escapeHTML(char1)}</span>`;
            }
            if (char2 !== undefined) {
                highlightedText2 += `<span class="diff">${escapeHTML(char2)}</span>`;
            }
        }
    }

    div1.innerHTML = highlightedText1;
    div2.innerHTML = highlightedText2;

    if (isSame && rawText1.length === rawText2.length) {
        resultDiv.innerHTML = "Success: Both contents are identical.";
        resultDiv.className = "result match";
    } else {
        resultDiv.innerHTML = "Notice: Differences found and highlighted in red.";
        resultDiv.className = "result different";
    }
}

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
