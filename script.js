const histories = { text1: { stack: [], redoStack: [], index: -1 }, text2: { stack: [], redoStack: [], index: -1 } };

function saveState(id) {
    const el = document.getElementById(id), content = el.innerHTML;
    if (histories[id].stack[histories[id].index] === content) return;
    histories[id].stack = histories[id].stack.slice(0, histories[id].index + 1);
    histories[id].stack.push(content);
    histories[id].index++;
    histories[id].redoStack = [];
    if (histories[id].stack.length > 50) { histories[id].stack.shift(); histories[id].index--; }
}

function undo(id) {
    if (histories[id].index > 0) {
        histories[id].redoStack.push(histories[id].stack[histories[id].index]);
        histories[id].index--;
        document.getElementById(id).innerHTML = histories[id].stack[histories[id].index];
    }
}

function redo(id) {
    if (histories[id].redoStack.length > 0) {
        const nextState = histories[id].redoStack.pop();
        histories[id].stack.push(nextState);
        histories[id].index++;
        document.getElementById(id).innerHTML = nextState;
    }
}

document.querySelectorAll('.editable-input').forEach(el => {
    el.addEventListener('input', () => saveState(el.id));
    el.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault(); if (e.shiftKey) redo(el.id); else undo(el.id);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            e.preventDefault(); redo(el.id);
        }
    });
    setTimeout(() => saveState(el.id), 100);
});

document.getElementById('text1').addEventListener('paste', handleCleanPaste);
document.getElementById('text2').addEventListener('paste', handleCleanPaste);
document.execCommand('defaultParagraphSeparator', false, 'div');

function handleCleanPaste(e) {
    e.preventDefault(); const id = e.target.id;
    let text = (e.originalEvent || e).clipboardData.getData('text/plain').trim();
    if (text.startsWith('"') && text.endsWith('"')) text = text.substring(1, text.length - 1);
    const html = text.replace(/"{2}/g, '"').split(/\r?\n/).filter(l => l.trim().length > 0)
        .map(l => `<div><span class="first-letter-blue">${esc(l.charAt(0))}</span>${esc(l.substring(1))}</div>`).join('');
    document.execCommand("insertHTML", false, html);
    saveState(id);
}

function compareAndHighlight() {
    const d1 = document.getElementById('text1'), d2 = document.getElementById('text2'), res = document.getElementById('result');
    const l1 = d1.innerText.split(/\r?\n/), l2 = d2.innerText.split(/\r?\n/);
    const maxL = Math.max(l1.length, l2.length);
    let h1 = "", h2 = "", isSame = true;

    for (let i = 0; i < maxL; i++) {
        const v1 = l1[i] || "", v2 = l2[i] || "";
        let r1 = "", r2 = ""; const maxC = Math.max(v1.length, v2.length);
        for (let j = 0; j < maxC; j++) {
            const c1 = v1[j], c2 = v2[j];
            if (c1 === c2) { r1 += esc(c1); r2 += esc(c2); }
            else { isSame = false; r1 += `<span class="diff">${esc(c1)||''}</span>`; r2 += `<span class="diff">${esc(c2)||''}</span>`; }
        }
        const render = (c) => {
            if (!c) return '<div><br></div>';
            let colored = c.replace(/^([^<&\s]|&[a-z]+;|<span class="diff">[^<]*<\/span>)/i, m => `<span class="first-letter-blue">${m}</span>`);
            return `<div>${colored}</div>`;
        };
        h1 += render(r1); h2 += render(r2);
    }
    d1.innerHTML = h1; d2.innerHTML = h2;
    saveState('text1'); saveState('text2');
    res.style.display = "block"; res.className = isSame ? "result match" : "result different";
    res.innerText = isSame ? "Success: Identical." : "Notice: Differences found.";
}

function clearBox(id) { document.getElementById(id).innerHTML = ''; saveState(id); }
function copyText(id, btn) { const t = document.getElementById(id).innerText; if (!t) return; navigator.clipboard.writeText(t).then(() => { btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1500); }); }
function esc(s) { return !s ? "" : s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])); }
