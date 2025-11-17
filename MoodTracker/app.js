// Selected Elements
const emojiContainer = document.querySelector(".emojiContainer");
const addMood = document.querySelector(".addMood");
const logs = document.querySelector(".logs");
const description = document.querySelector("#description");

// Set to LocalStorage
let moodLogs = JSON.parse(localStorage.getItem("moodLogs")) || [];

// Emojis Array
const emojis = [
  { emojis: "😄", title: "Happy" },
  { emojis: "😢", title: "Sad" },
  { emojis: "😰", title: "Fear" },
  { emojis: "😖", title: "Disgust" },
  { emojis: "😤", title: "Anger" },
  { emojis: "🤩", title: "Surprise" },
];

// Storing Selected emojis
let SelectedMood = null;

function renderLogs(filtered = moodLogs) {
  logs.innerHTML = "";

  filtered.forEach((entry) => {
    let log = document.createElement("div");
    log.classList.add(
      "bg-white",
      "shadow",
      "p-3",
      "rounded-lg",
      "border",
      "border-gray-300",
      "flex",
      "items-start",
      "gap-3",
      "text-base",
      "md:text-lg",
      "w-full"
    );

    log.innerHTML = `
      <span class="text-4xl flex-shrink-0">${entry.emoji}</span>
      <div class="flex flex-col flex-grow">
        <p class="font-bold">${entry.title}</p>
        <p class="text-sm text-gray-700 whitespace-normal break-words">${entry.description}</p>
        <p class="text-xs text-gray-500 mt-1">${entry.date}</p>
      </div>
    `;

    logs.appendChild(log);
  });
}


renderLogs();

addMood.addEventListener("click", function () {
  if (!SelectedMood) {
    alert("Please select a mood first!...");
    return;
  }

  const moodEntry = {
    emoji: SelectedMood.emojis,
    title: SelectedMood.title,
    description: description.value || "No description.",
    date: new Date().toLocaleString(),
  };

  moodLogs.push(moodEntry);
  localStorage.setItem("moodLogs", JSON.stringify(moodLogs));

  renderLogs();

  description.value = ""; // clear input

  document.querySelectorAll(".emojiContainer div").forEach((box) => {
    box.classList.remove("ring", "ring-2", "ring-green-400");
  });

  SelectedMood = null;
});

// Create Emoji Boxes
emojis.forEach((item) => {
  const emojiBox = document.createElement("div");
  emojiBox.classList.add(
    "cursor-pointer",
    "bg-gradient-to-tr",
    "from-slate-50",
    "to-gray-100",
    "border",
    "border-red-100",
    "shadow-lg",
    "flex",
    "flex-col",
    "items-center",
    "gap-1",
    "py-2",
    "px-4",
    "rounded-lg",
    "text-2xl",
    "md:text-5xl",
    "hover:scale-110",
    "transition",
    "w-full"
  );

  const emojiSymbol = document.createElement("span");
  emojiSymbol.textContent = item.emojis;

  // Title
  const emojiTitle = document.createElement("span");
  emojiTitle.textContent = item.title;
  emojiTitle.classList.add("text-sm","md:text-lg", "font-semibold", "text-black");

  emojiBox.appendChild(emojiSymbol);
  emojiBox.appendChild(emojiTitle);
  emojiContainer.appendChild(emojiBox);

  emojiBox.addEventListener("click", function () {
    SelectedMood = item;

    document.querySelectorAll(".emojiContainer div").forEach((div) => {
      div.classList.remove("ring", "ring-2", "ring-green-400");
    });
    emojiBox.classList.add("ring", "ring-2", "ring-green-400");
  });
});

function parseDate(dateString) {
  return new Date(dateString);
}


function filterLogs(type) {
  const now = new Date();

  return moodLogs.filter((entry) => {
    const entryDate = parseDate(entry.date);

    switch (type) {
      case "daily":
        return entryDate.toDateString() === now.toDateString();

      case "weekly":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return entryDate >= oneWeekAgo;

      case "monthly":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return entryDate >= oneMonthAgo;

      default:
        return true;
    }
  });
}

function filterByCalendar(selectedDate) {
  return moodLogs.filter(entry => {
    const entryDate = parseDate(entry.date);
    return entryDate.toDateString() === selectedDate.toDateString();
  });
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-filter");
    const filtered = filterLogs(type);
    renderLogs(filtered);
  });
});


document.querySelector("#calendarFilter").addEventListener("change", (e) => {
  const selectedDate = new Date(e.target.value);
  const filtered = filterByCalendar(selectedDate);
  renderLogs(filtered);
});
