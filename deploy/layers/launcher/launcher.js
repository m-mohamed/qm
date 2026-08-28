const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');
const oceanFrame = document.querySelector("#ocean-frame");
const oceanStatus = document.querySelector("#ocean-status");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const getStoredTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem("sw-capital-theme");
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

const getActiveTheme = () => root.dataset.theme || (systemTheme.matches ? "dark" : "light");

const syncThemeControls = () => {
  const activeTheme = getActiveTheme();
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  themeToggle?.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  if (themeLabel) themeLabel.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
  themeColor?.setAttribute("content", activeTheme === "dark" ? "#07181d" : "#0c242c");
};

const storedTheme = getStoredTheme();
if (storedTheme) root.dataset.theme = storedTheme;
syncThemeControls();

themeToggle?.addEventListener("click", () => {
  const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;

  try {
    window.localStorage.setItem("sw-capital-theme", nextTheme);
  } catch {
    // The selected appearance still applies to the current page.
  }

  syncThemeControls();
});

systemTheme.addEventListener("change", () => {
  if (!root.dataset.theme) syncThemeControls();
});

if (!("gpu" in navigator)) {
  body.dataset.ocean = "fallback";
  oceanFrame?.remove();
  if (oceanStatus) oceanStatus.textContent = "Ocean view";
} else {
  oceanFrame?.addEventListener(
    "load",
    () => {
      body.dataset.ocean = "ready";
    },
    { once: true },
  );
}
