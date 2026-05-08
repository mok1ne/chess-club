(function () {
  var track = document.getElementById("partTrack");
  var counter = document.getElementById("partCounter");
  var btnPrev = document.getElementById("partPrev");
  var btnNext = document.getElementById("partNext");

  var total = 6;
  var current = 0;
  var autoTimer;

  function getPerPage() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function getTotalPages() {
    var pp = getPerPage();
    return Math.ceil(total / pp);
  }

  function getCardWidth() {
    var cards = track.querySelectorAll(".participant-card");
    if (!cards.length) return 0;
    var pp = getPerPage();
    var outerWidth = track.parentElement.offsetWidth;
    var gap = 24;
    return (outerWidth - gap * (pp - 1)) / pp;
  }

  function setCardWidths() {
    var pp = getPerPage();
    var gap = 24;
    var outerWidth = track.parentElement.offsetWidth;
    var cardW = (outerWidth - gap * (pp - 1)) / pp;
    var cards = track.querySelectorAll(".participant-card");
    cards.forEach(function (c, i) {
      c.style.flex = "0 0 " + cardW + "px";
      c.style.marginRight = i < cards.length - 1 ? gap + "px" : "0";
    });
  }

  function goTo(idx) {
    var pp = getPerPage();
    var totalPages = getTotalPages();

    // Зацикливание
    if (idx < 0) idx = totalPages - 1;
    if (idx >= totalPages) idx = 0;
    current = idx;

    var cardW = getCardWidth();
    var gap = 24;

    var offset = current * pp * (cardW + gap);

    track.style.transform = "translateX(-" + offset + "px)";

    var lastVisible = Math.min((current + 1) * pp, total);
    counter.textContent = lastVisible + " / " + total;
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  btnNext.addEventListener("click", function () {
    clearAuto();
    next();
    startAuto();
  });
  btnPrev.addEventListener("click", function () {
    clearAuto();
    prev();
    startAuto();
  });

  function startAuto() {
    clearAuto();
    autoTimer = setInterval(next, 4000);
  }
  function clearAuto() {
    clearInterval(autoTimer);
  }

  window.addEventListener("resize", function () {
    setCardWidths();
    goTo(current);
  });

  setCardWidths();
  goTo(0);
  startAuto();
})();
(function () {
  var track = document.getElementById("stagesTrack");
  var btnPrev = document.getElementById("stagesPrev");
  var btnNext = document.getElementById("stagesNext");
  var dotsContainer = document.getElementById("stagesDots");
  if (!track) return;

  var total = 5;
  var current = 0;
  var dots = dotsContainer ? dotsContainer.querySelectorAll(".stages-dot") : [];

  function updateDots() {
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function goTo(idx) {
    if (idx < 0 || idx >= total) return;
    current = idx;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
    updateDots();
  }

  btnPrev.addEventListener("click", function () {
    goTo(current - 1);
  });
  btnNext.addEventListener("click", function () {
    goTo(current + 1);
  });

  // Клик по точкам
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      goTo(parseInt(this.dataset.idx));
    });
  });

  goTo(0);
})();

(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach(function (el) {
      observer.observe(el);
    });

  var stageCards = document.querySelectorAll(".stages-grid .stage-card");

  var cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(stageCards).indexOf(entry.target);
          setTimeout(function () {
            entry.target.style.opacity = "1";
            entry.target.style.translate = "0";
          }, idx * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  stageCards.forEach(function (card) {
    card.style.opacity = "0";
    card.style.translate = "0 30px";
    card.style.transition = "opacity 0.6s ease, translate 0.6s ease";
    cardObserver.observe(card);
  });
})();
