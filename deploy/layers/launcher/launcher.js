const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');

const getStoredTheme = () => {
  try {
    const storedTheme = window.localStorage.getItem("sw-capital-theme");
    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
};

const getActiveTheme = () => root.dataset.theme || "light";

const syncThemeControls = () => {
  const activeTheme = getActiveTheme();
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  themeToggle?.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  if (themeLabel) themeLabel.textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
  themeColor?.setAttribute("content", activeTheme === "dark" ? "#1a1d1b" : "#d99061");
};

const storedTheme = getStoredTheme();
root.dataset.theme = storedTheme ?? "light";
body.dataset.ocean = "fallback";
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
