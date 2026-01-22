async function translateWords() {
  const en = document.getElementById("english").value;

  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: en,
      source: "en",
      target: "he",
      format: "text"
    })
  });

  const data = await res.json();
  document.getElementById("hebrew").value = data.translatedText;
}

function saveGame() {
  const en = document.getElementById("english").value.split("\n");
  const he = document.getElementById("hebrew").value.split("\n");

  const pairs = en.map((e, i) => ({
    en: e.trim(),
    he: he[i]?.trim() || ""
  }));

  localStorage.setItem("savedGame", JSON.stringify(pairs));
  location.href = "game.html";
}

function startGame(type) {
  const data = JSON.parse(localStorage.getItem("savedGame"));
  const game = document.getElementById("game");
  game.innerHTML = "";

  let left = [];
  let right = [];

  data.forEach(p => {
    if (type === "match") {
      left.push(p.en);
      right.push(p.he);
    } else {
      left.push(p.he);
      right.push(p.en);
    }
  });

  right.sort(() => Math.random() - 0.5);

  left.forEach(w => {
    const d = document.createElement("div");
    d.className = "word";
    d.innerText = w;
    game.appendChild(d);
  });

  game.appendChild(document.createElement("hr"));

  right.forEach(w => {
    const d = document.createElement("div");
    d.className = "word";
    d.innerText = w;
    game.appendChild(d);
  });
}

function share() {
  const data = localStorage.getItem("savedGame");
  const link = location.origin + location.pathname.replace("game.html","") +
    "game.html?data=" + btoa(data);
  prompt("העתק קישור:", link);
}

(function loadFromLink(){
  const params = new URLSearchParams(location.search);
  if (params.get("data")) {
    const decoded = JSON.parse(atob(params.get("data")));
    localStorage.setItem("savedGame", JSON.stringify(decoded));
  }
})();
