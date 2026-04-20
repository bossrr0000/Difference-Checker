document.getElementById('text1').addEventListener('paste', handleCleanPaste);
document.getElementById('text2').addEventListener('paste', handleCleanPaste);

function handleCleanPaste(e) {
    e.preventDefault();
    let text = (e.originalEvent || e).clipboardData.getData('text/plain');

    let cleanedText = text.trim();
    if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
        cleanedText = cleanedText.substring(1, cleanedText.length - 1);
    }

    const processed = cleanedText
        .replace(/"{2}/g, '"')  
        .split(/\r?\n/)
        .map(line => line.trim()) 
        .filter(line => line.length > 0)
        .join('\n');

    document.execCommand("insertText", false, processed);
    
    setTimeout(() => reformatDivs(e.target), 10);
}

function reformatDivs(el) {
    const text = el.innerText;
    if (!text) return;
    const html = text.split('\n').map(line => `<div>${esc(line)}</div>`).join('');
    el.innerHTML = html;
}

function clearBox(id) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    el.focus();
    document.getElementById('result').style.display = 'none';
}

function compareAndHighlight() {
    const div1 = document.getElementById('text1');
    const div2 = document.getElementById('text2');
    const resultDiv = document.getElementById('result');

    const raw1 = div1.innerText;
    const raw2 = div2.innerText;

    if (!raw1.trim() && !raw2.trim()) return;

    const max = Math.max(raw1.length, raw2.length);
    let h1 = "", h2 = "", isSame = true;

    for (let i = 0; i < max; i++) {
        const c1 = raw1[i], c2 = raw2[i];
        if (c1 === c2) {
            h1 += (c1 === '\n' ? '<br>' : esc(c1));
            h2 += (c2 === '\n' ? '<br>' : esc(c2));
        } else {
            isSame = false;
            h1 += `<span class="diff">${c1 === undefined ? '' : (c1 === '\n' ? '↵' : esc(c1))}</span>`;
            h2 += `<span class="diff">${c2 === undefined ? '' : (c2 === '\n' ? '↵' : esc(c2))}</span>`;
        }
    }

    const wrap = (text) => text.split('<br>').map(l => `<div>${l}</div>`).join('');
    div1.innerHTML = wrap(h1);
    div2.innerHTML = wrap(h2);

    resultDiv.style.display = "block";
    resultDiv.className = isSame ? "result match" : "result different";
    resultDiv.innerText = isSame ? "Success: Identical." : "Notice: Differences found (Red text).";
}

function copyText(elementId, btn) {
    const text = document.getElementById(elementId).innerText;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1500);
    });
}

function esc(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}
