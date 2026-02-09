// Padaro visus "Netinka" žodžius raudonus Q&A
document.querySelectorAll('.qa').forEach(item => {
    item.innerHTML = item.innerHTML.replace(/(Netinka)/g, '<span style="color:red;">$1</span>');
});

// Normalizuoja lietuviškas raides ir pašalina skyrybą
function normalizeLT(text) {
    const map = {
        'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z',
        'Ą':'A','Č':'C','Ę':'E','Ė':'E','Į':'I','Š':'S','Ų':'U','Ū':'U','Ž':'Z'
    };
    return text
        .replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, m => map[m])
        .replace(/[.,!?;:„“"']/g, '');
}

// Click-to-open atsakymai (tik paspaudus klausimą)
document.querySelectorAll('.qa h3').forEach(h3 => {
    h3.addEventListener('click', () => {
        const answer = h3.nextElementSibling;
        if (answer) {
            answer.style.display = answer.style.display === "block" ? "none" : "block";
        }
    });
});

// ─── PAIEŠKA ────────────────────────────────────────────────────────────────

const searchInput = document.getElementById("search");
const qaItems = document.querySelectorAll(".qa");
const noResults = document.getElementById("no-results");

searchInput.addEventListener("keyup", () => {
    const searchText = normalizeLT(searchInput.value.toLowerCase().trim());

    let foundCount = 0;

    qaItems.forEach(item => {
        const h3 = item.querySelector("h3");
        if (!h3) {
            item.style.display = "none";
            return;
        }

        const questionText = normalizeLT(h3.innerText.toLowerCase().trim());

        // SVARBIAUSIA: startsWith – tik nuo pradžios
        if (searchText === "" || questionText.startsWith(searchText)) {
            item.style.display = "block";
            foundCount++;
        } else {
            item.style.display = "none";
        }
    });

    // „Nieko nerasta“ logika
    if (noResults) {
        noResults.style.display = (foundCount === 0 && searchText !== "") ? "block" : "none";
    }
});
// Prisijungimas prie Socket.io serverio
const socket = io();  // Automatiškai jungiasi prie to paties serverio (localhost ar hostingo)

// Gauti aktyvių vartotojų skaičių
socket.on('userCount', (count) => {
    document.getElementById('user-count').innerText = `Aktyvių vartotojų: ${count}`;
});