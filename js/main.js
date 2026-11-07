/* =========================================================
   Learnly - script principal
   1. Menu burger
   2. Sauvegarde de la progression (localStorage)
   3. Page d'accueil : recherche, filtres, progression des cartes
   4. Page de cours : navigation entre leçons + barre de progression
   ========================================================= */

/* ---------- 1. Menu burger ---------- */
const burger = document.querySelector(".burger");
const menu = document.querySelector("#menu");

if (burger && menu) {
  burger.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen);
    burger.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  // Ferme le menu quand on clique sur un lien
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Ouvrir le menu");
    });
  });
}

/* ---------- 2. Sauvegarde de la progression ---------- */
// On garde la liste des leçons terminées pour chaque cours, ex : ["html-1", "html-2"]
function getDone(course) {
  try {
    return JSON.parse(localStorage.getItem("learnly-" + course)) || [];
  } catch (error) {
    return [];
  }
}

function saveDone(course, list) {
  try {
    localStorage.setItem("learnly-" + course, JSON.stringify(list));
  } catch (error) {
    // Stockage indisponible (navigation privée) : la progression ne sera pas gardée
  }
}

/* ---------- 3. Page d'accueil ---------- */
const cards = document.querySelectorAll(".card");
const searchInput = document.querySelector("#search");
const filterButtons = document.querySelectorAll(".filter");
const emptyMessage = document.querySelector("#empty");
let currentCategory = "all";

// Affiche la progression sauvegardée sur chaque carte de cours
document.querySelectorAll(".card-progress").forEach(function (box) {
  const done = getDone(box.dataset.course).length;
  const total = Number(box.dataset.total);
  const percent = Math.round((done / total) * 100);
  box.querySelector(".progress-fill").style.width = percent + "%";
  box.querySelector("small").textContent = percent + " % terminé";
});

function filterCourses() {
  const text = searchInput ? searchInput.value.trim().toLowerCase() : "";
  let visible = 0;

  cards.forEach(function (card) {
    const matchCategory = currentCategory === "all" || card.dataset.category === currentCategory;
    const matchText = card.textContent.toLowerCase().includes(text);
    card.hidden = !(matchCategory && matchText);
    if (!card.hidden) visible++;
  });

  if (emptyMessage) emptyMessage.hidden = visible > 0;
}

if (searchInput) {
  searchInput.addEventListener("input", filterCourses);
  searchInput.form.addEventListener("submit", function (event) {
    event.preventDefault();
    filterCourses();
    document.querySelector("#cours").scrollIntoView();
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (b) {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    currentCategory = button.dataset.filter;
    filterCourses();
  });
});

// Formulaire d'inscription (simulation)
const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = signupForm.querySelector("input").value;
    signupForm.querySelector(".form-message").textContent =
      "Merci ! Un e-mail de bienvenue a été envoyé à " + email + ".";
    signupForm.reset();
  });
}

/* ---------- 4. Page de cours ---------- */
const lessons = document.querySelectorAll(".lesson");

if (lessons.length > 0) {
  const course = document.body.dataset.course;
  const links = document.querySelectorAll(".lesson-list a");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const completeBtn = document.querySelector("#complete");
  const resetBtn = document.querySelector("#reset");
  const progressBar = document.querySelector("#progress");
  const progressFill = progressBar.querySelector(".progress-fill");
  const progressText = document.querySelector("#progress-text");
  const congrats = document.querySelector("#congrats");
  let done = getDone(course);
  let current = 0;

  function showLesson(index) {
    // Stoppe la vidéo de la leçon qu'on quitte (on recharge l'iframe)
    const oldVideo = lessons[current].querySelector("iframe");
    if (oldVideo && index !== current) oldVideo.src = oldVideo.src;

    current = index;

    lessons.forEach(function (lesson, i) {
      lesson.hidden = i !== index;
    });

    links.forEach(function (link, i) {
      link.classList.toggle("active", i === index);
      if (i === index) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === lessons.length - 1;
    history.replaceState(null, "", "#" + lessons[index].id);
    updateCompleteButton();
  }

  function updateCompleteButton() {
    const isDone = done.includes(lessons[current].id);
    completeBtn.textContent = isDone ? "✓ Leçon terminée" : "Marquer comme terminée";
    completeBtn.classList.toggle("btn-success", isDone);
    completeBtn.classList.toggle("btn-primary", !isDone);
  }

  function updateProgress() {
    const percent = Math.round((done.length / lessons.length) * 100);
    progressFill.style.width = percent + "%";
    progressBar.setAttribute("aria-valuenow", percent);
    progressText.textContent = percent + " %";

    links.forEach(function (link) {
      link.classList.toggle("done", done.includes(link.hash.slice(1)));
    });

    congrats.hidden = percent < 100;
    updateCompleteButton();
  }

  function goTo(index) {
    showLesson(index);
    document.querySelector(".lesson-area").scrollIntoView();
  }

  // Clic dans le programme du cours
  links.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      goTo(i);
    });
  });

  prevBtn.addEventListener("click", function () {
    goTo(current - 1);
  });

  nextBtn.addEventListener("click", function () {
    goTo(current + 1);
  });

  // Marquer / démarquer la leçon, puis passer à la suivante
  completeBtn.addEventListener("click", function () {
    const id = lessons[current].id;

    if (done.includes(id)) {
      done = done.filter(function (item) {
        return item !== id;
      });
    } else {
      done.push(id);
      if (current < lessons.length - 1) showLesson(current + 1);
    }

    saveDone(course, done);
    updateProgress();
  });

  resetBtn.addEventListener("click", function () {
    done = [];
    saveDone(course, done);
    updateProgress();
    goTo(0);
  });

  // Ouvre la leçon indiquée dans l'URL (ex : cours-html.html#html-3)
  let start = 0;
  lessons.forEach(function (lesson, i) {
    if ("#" + lesson.id === location.hash) start = i;
  });

  showLesson(start);
  updateProgress();
}

// Petite démo interactive (leçon JavaScript sur les événements)
const demoBtn = document.querySelector("#demo-btn");
if (demoBtn) {
  let clicks = 0;
  demoBtn.addEventListener("click", function () {
    clicks++;
    document.querySelector("#demo-count").textContent = clicks;
  });
}
