function compareAndHighlight() {
    const div1 = document.getElementById('text1');
    const div2 = document.getElementById('text2');
    const resultDiv = document.getElementById('result');

    const rawText1 = div1.innerText;
    const rawText2 = div2.innerText;

    if (!rawText1.trim() && !rawText2.trim()) {
        resultDiv.innerHTML = "Please enter content.";
        resultDiv.className = "result different";
        resultDiv.style.display = "block";
        return;
    }

    const maxLength = Math.max(rawText1.length, rawText2.length);
    let h1 = "";
    let h2 = "";
    let isSame = true;

    for (let i = 0; i < maxLength; i++) {
        const c1 = rawText1[i];
        const c2 = rawText2[i];

        if (c1 === c2) {
            if (c1 !== undefined) h1 += esc(c1);
            if (c2 !== undefined) h2 += esc(c2);
        } else {
            isSame = false;
            if (c1 !== undefined) h1 += `<span class="diff">${esc(c1)}</span>`;
            if (c2 !== undefined) h2 += `<span class="diff">${esc(c2)}</span>`;
        }
    }

    div1.innerHTML = h1;
    div2.innerHTML = h2;

    if (isSame && rawText1.length === rawText2.length) {
        resultDiv.innerHTML = "Success: Both contents are identical.";
        resultDiv.className = "result match";
    } else {
        resultDiv.innerHTML = "Notice: Differences found.";
        resultDiv.className = "result different";
    }
    resultDiv.style.display = "block";
}

function esc(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}
