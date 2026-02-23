// Edit this single constant to control CTA globally.
const CTA_BUTTON = {
  url: "https://instagram.com/muslim_ruhr",
  textByLang: {
    id: "Lihat Instagram",
    de: "Instagram ansehen",
    en: "See Instagram"
  }
};

const LANGUAGE_FILES = {
  id: "lang/id.json",
  de: "lang/de.json",
  en: "lang/en.json"
};

const STORAGE_KEYS = {
  theme: "muslim-ruhr-theme",
  focusMode: "muslim-ruhr-focus-mode",
  language: "muslim-ruhr-language"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  lang: "id",
  activityFilter: "all",
  langCache: {},
  content: null
};

const dom = {
  root: document.documentElement,
  metaDescription: document.querySelector('meta[name="description"]'),
  metaOgTitle: document.querySelector('meta[property="og:title"]'),
  metaOgDescription: document.querySelector('meta[property="og:description"]'),
  metaOgLocale: document.querySelector('meta[property="og:locale"]'),
  skipLink: document.getElementById("skipLink"),
  siteHeader: document.getElementById("siteHeader"),
  headerControls: document.getElementById("headerControls"),
  brandPill: document.getElementById("brandPill"),
  scrollProgressBar: document.getElementById("scrollProgressBar"),
  themeToggle: document.getElementById("themeToggle"),
  focusToggle: document.getElementById("focusToggle"),
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  heroTagline: document.getElementById("heroTagline"),
  heroDesc: document.getElementById("heroDesc"),
  heroCta: document.getElementById("heroCta"),
  footerCta: document.getElementById("footerCta"),
  languageSwitch: document.getElementById("languageSwitch"),
  langChips: Array.from(document.querySelectorAll(".lang-chip")),
  aboutEyebrow: document.getElementById("aboutEyebrow"),
  aboutTitle: document.getElementById("aboutTitle"),
  aboutDesc: document.getElementById("aboutDesc"),
  missionCards: document.getElementById("missionCards"),
  activitiesEyebrow: document.getElementById("activitiesEyebrow"),
  activitiesTitle: document.getElementById("activitiesTitle"),
  activitiesDesc: document.getElementById("activitiesDesc"),
  activityFilters: document.getElementById("activityFilters"),
  activityGrid: document.getElementById("activityGrid"),
  timelineEyebrow: document.getElementById("timelineEyebrow"),
  timelineTitle: document.getElementById("timelineTitle"),
  timelineDesc: document.getElementById("timelineDesc"),
  timelineList: document.getElementById("timelineList"),
  timelineProgressFill: document.getElementById("timelineProgressFill"),
  faqEyebrow: document.getElementById("faqEyebrow"),
  faqTitle: document.getElementById("faqTitle"),
  faqDesc: document.getElementById("faqDesc"),
  faqList: document.getElementById("faqList"),
  instagramText: document.getElementById("instagramText"),
  footerDesc: document.getElementById("footerDesc"),
  contactLabel: document.getElementById("contactLabel"),
  contactHint: document.getElementById("contactHint"),
  disclaimer: document.getElementById("disclaimer"),
  backToTop: document.getElementById("backToTop")
};

function getCtaTextForLanguage(lang) {
  const byLang = CTA_BUTTON.textByLang || {};
  return byLang[lang] || byLang.id || "Lihat Instagram";
}

async function loadLanguagePack(lang) {
  if (!LANGUAGE_FILES[lang]) {
    throw new Error(`Language ${lang} is not configured.`);
  }

  if (state.langCache[lang]) {
    return state.langCache[lang];
  }

  const response = await fetch(LANGUAGE_FILES[lang], { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to load ${LANGUAGE_FILES[lang]} (${response.status})`);
  }

  const data = await response.json();
  state.langCache[lang] = data;
  return data;
}

function setTheme(theme) {
  dom.root.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  const label = state.content
    ? isDark
      ? state.content.ui.themeDark
      : state.content.ui.themeLight
    : isDark
      ? "Mode Terang"
      : "Mode Gelap";

  dom.themeToggle.textContent = label;
  dom.themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function setFocusMode(enabled) {
  dom.root.classList.toggle("focus-mode", enabled);
  const label = state.content
    ? enabled
      ? state.content.ui.focusOn
      : state.content.ui.focusOff
    : enabled
      ? "Focus Mode: On"
      : "Focus Mode";

  dom.focusToggle.textContent = label;
  dom.focusToggle.setAttribute("aria-pressed", String(enabled));
  localStorage.setItem(STORAGE_KEYS.focusMode, String(enabled));
}

function renderMeta(content) {
  document.title = content.meta.title;
  dom.metaDescription.setAttribute("content", content.meta.description);
  dom.metaOgTitle.setAttribute("content", content.meta.ogTitle);
  dom.metaOgDescription.setAttribute("content", content.meta.ogDescription);
  dom.metaOgLocale.setAttribute("content", content.meta.ogLocale);
  dom.root.lang = state.lang;
}

function renderGlobalLabels(content) {
  dom.skipLink.textContent = content.ui.skipLink;
  dom.siteHeader.setAttribute("aria-label", content.ui.headerLabel);
  dom.headerControls.setAttribute("aria-label", content.ui.headerControlsLabel);
  dom.languageSwitch.setAttribute("aria-label", content.ui.languageSwitchLabel);
  dom.missionCards.setAttribute("aria-label", content.ui.missionListLabel);
  dom.activityFilters.setAttribute("aria-label", content.ui.activityFiltersLabel);
  dom.timelineList.setAttribute("aria-label", content.ui.timelineListLabel);

  dom.brandPill.textContent = content.brand;
  dom.contactLabel.textContent = content.ui.contactLabel;
  dom.contactHint.textContent = content.ui.contactHint;
  dom.disclaimer.textContent = content.ui.disclaimer;
  dom.instagramText.textContent = content.instagramHandle;
  dom.backToTop.textContent = content.ui.backToTop;

  const ctaText = getCtaTextForLanguage(state.lang);
  dom.heroCta.textContent = ctaText;
  dom.heroCta.href = CTA_BUTTON.url;
  dom.footerCta.textContent = ctaText;
  dom.footerCta.href = CTA_BUTTON.url;

  const currentTheme = dom.root.getAttribute("data-theme") || "light";
  const focusEnabled = dom.root.classList.contains("focus-mode");
  setTheme(currentTheme);
  setFocusMode(focusEnabled);
}

function renderHero(content) {
  dom.heroEyebrow.textContent = content.hero.eyebrow;
  dom.heroTitle.textContent = content.hero.title;
  dom.heroTagline.textContent = content.hero.tagline;
  dom.heroDesc.textContent = content.hero.description;
}

function renderAbout(content) {
  const about = content.sections.about;
  dom.aboutEyebrow.textContent = about.eyebrow;
  dom.aboutTitle.textContent = about.title;
  dom.aboutDesc.textContent = about.description;

  dom.missionCards.innerHTML = "";
  about.missionCards.forEach((card, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "mission-card";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-expanded", "false");
    item.innerHTML = `
      <span class="mission-card__title">${card.title}</span>
      <span class="mission-card__body" id="mission-body-${index}">${card.description}</span>
    `;

    item.addEventListener("click", () => {
      const isOpen = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", String(!isOpen));
    });

    dom.missionCards.appendChild(item);
  });
}

function renderActivities(content) {
  const activities = content.sections.activities;

  dom.activitiesEyebrow.textContent = activities.eyebrow;
  dom.activitiesTitle.textContent = activities.title;
  dom.activitiesDesc.textContent = activities.description;

  const isValidFilter = activities.categories.some((cat) => cat.key === state.activityFilter);
  if (!isValidFilter) {
    state.activityFilter = "all";
  }

  dom.activityFilters.innerHTML = "";
  activities.categories.forEach((category) => {
    const btn = document.createElement("button");
    const isActive = category.key === state.activityFilter;

    btn.type = "button";
    btn.className = `chip ${isActive ? "is-active" : ""}`;
    btn.dataset.category = category.key;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(isActive));
    btn.textContent = category.label;

    btn.addEventListener("click", () => {
      state.activityFilter = category.key;
      renderActivities(state.content);
    });

    dom.activityFilters.appendChild(btn);
  });

  const labelsByKey = Object.fromEntries(activities.categories.map((cat) => [cat.key, cat.label]));

  dom.activityGrid.innerHTML = "";
  activities.cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "activity-card";
    article.dataset.category = card.categoryKey;
    article.innerHTML = `
      <p class="activity-meta">${labelsByKey[card.categoryKey] || card.categoryKey}</p>
      <h3>${card.title}</h3>
      <p>${card.detail}</p>
    `;
    dom.activityGrid.appendChild(article);
  });

  filterActivities();
}

function filterActivities() {
  const cards = Array.from(dom.activityGrid.querySelectorAll(".activity-card"));
  cards.forEach((card, idx) => {
    const shouldShow = state.activityFilter === "all" || card.dataset.category === state.activityFilter;
    window.setTimeout(() => {
      card.classList.toggle("hidden", !shouldShow);
      card.setAttribute("aria-hidden", String(!shouldShow));
    }, prefersReducedMotion ? 0 : idx * 30);
  });
}

function renderTimeline(content) {
  const timeline = content.sections.timeline;
  dom.timelineEyebrow.textContent = timeline.eyebrow;
  dom.timelineTitle.textContent = timeline.title;
  dom.timelineDesc.textContent = timeline.description;

  dom.timelineList.innerHTML = "";
  timeline.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = "timeline-item";
    li.setAttribute("aria-expanded", index === 0 ? "true" : "false");
    li.innerHTML = `
      <button class="timeline-toggle" type="button" aria-controls="timeline-detail-${index}" aria-expanded="${index === 0}">
        ${step.title}
      </button>
      <div id="timeline-detail-${index}" class="timeline-detail">${step.detail}</div>
    `;

    const toggle = li.querySelector(".timeline-toggle");
    toggle.addEventListener("click", () => {
      const expanded = li.getAttribute("aria-expanded") === "true";
      li.setAttribute("aria-expanded", String(!expanded));
      toggle.setAttribute("aria-expanded", String(!expanded));
    });

    dom.timelineList.appendChild(li);
  });
}

function renderFaq(content) {
  const faq = content.sections.faq;
  dom.faqEyebrow.textContent = faq.eyebrow;
  dom.faqTitle.textContent = faq.title;
  dom.faqDesc.textContent = faq.description;

  dom.faqList.innerHTML = "";
  faq.items.forEach((item, index) => {
    const wrapper = document.createElement("article");
    wrapper.className = "faq-item";
    wrapper.setAttribute("aria-expanded", "false");

    wrapper.innerHTML = `
      <h3>
        <button
          id="faq-question-${index}"
          class="faq-question"
          type="button"
          aria-expanded="false"
          aria-controls="faq-answer-${index}"
        >
          ${item.question}
        </button>
      </h3>
      <div id="faq-answer-${index}" class="faq-answer" role="region" aria-labelledby="faq-question-${index}">
        <p>${item.answer}</p>
      </div>
    `;

    const button = wrapper.querySelector(".faq-question");
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      wrapper.setAttribute("aria-expanded", String(!isOpen));
    });

    dom.faqList.appendChild(wrapper);
  });
}

function renderFooter(content) {
  dom.footerDesc.textContent = content.sections.footer.description;
}

function setLanguageChipState() {
  dom.langChips.forEach((chip) => {
    const active = chip.dataset.lang === state.lang;
    chip.classList.toggle("is-active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
}

async function applyLanguage(lang) {
  try {
    const content = await loadLanguagePack(lang);
    state.lang = lang;
    state.content = content;

    renderMeta(content);
    renderGlobalLabels(content);
    renderHero(content);
    renderAbout(content);
    renderActivities(content);
    renderTimeline(content);
    renderFaq(content);
    renderFooter(content);
    setLanguageChipState();

    localStorage.setItem(STORAGE_KEYS.language, lang);
  } catch (error) {
    // Keep current language as-is if loading fails.
    console.error(error);
  }
}

function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max <= 0 ? 0 : (window.scrollY / max) * 100;
  dom.scrollProgressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}

function updateTimelineProgress() {
  const timelineSection = document.getElementById("timeline");
  const rect = timelineSection.getBoundingClientRect();
  const viewport = window.innerHeight;
  const start = viewport * 0.2;
  const end = viewport * 0.8;
  const distance = end - start;
  const current = end - rect.top;
  const progress = Math.max(0, Math.min(1, current / (rect.height + distance)));
  dom.timelineProgressFill.style.height = `${progress * 100}%`;
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((el) => observer.observe(el));
}

function bindEvents() {
  dom.themeToggle.addEventListener("click", () => {
    const current = dom.root.getAttribute("data-theme") || "light";
    setTheme(current === "light" ? "dark" : "light");
  });

  dom.focusToggle.addEventListener("click", () => {
    const enabled = dom.root.classList.contains("focus-mode");
    setFocusMode(!enabled);
  });

  dom.langChips.forEach((chip) => {
    chip.addEventListener("click", async () => {
      if (chip.dataset.lang !== state.lang) {
        await applyLanguage(chip.dataset.lang);
      }
    });
  });

  dom.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", () => {
    updateScrollProgress();
    updateTimelineProgress();
  });

  window.addEventListener("resize", () => {
    updateScrollProgress();
    updateTimelineProgress();
  });
}

function initPreferences() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const savedFocus = localStorage.getItem(STORAGE_KEYS.focusMode);
  const savedLanguage = localStorage.getItem(STORAGE_KEYS.language);

  if (savedLanguage && LANGUAGE_FILES[savedLanguage]) {
    state.lang = savedLanguage;
  }

  setTheme(savedTheme === "dark" ? "dark" : "light");
  setFocusMode(savedFocus === "true");
}

async function init() {
  initPreferences();
  bindEvents();
  setupRevealAnimations();

  await applyLanguage(state.lang);

  updateScrollProgress();
  updateTimelineProgress();
}

init();
