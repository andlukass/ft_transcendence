import { getDarkMode, setDarkMode } from "../../lib/utils";
import { navigate } from "../../router";

export function Topbar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "shadow-sm border-b border-gray-200";

  const isDark = getDarkMode();

  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:justify-between h-fit py-0 max-sm:mb-3 sm:py-4 max-sm:gap-2">
        <div class="shrink-0 flex items-center max-sm:justify-center">
          <a 
            href="/" 
            class="gap-2 no-underline text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm font-medium cursor-pointer"
            data-link="home"
          >
            <img src="/pong.svg" alt="The Pong Game" class="w-6 h-6" />
            <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">The Pong Game</h1>
          </a>
        </div>
        <div class="flex items-center gap-4">
          <div class="ml-6 flex space-x-8 text-center">
            <a 
              href="/local" 
              class="no-underline text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm font-medium cursor-pointer"
              data-link="local"
            >
              Local Match
            </a>
            <a 
              href="/match" 
              class="no-underline text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm font-medium cursor-pointer"
              data-link="match"
            >
              Remote Match
            </a>
            <a 
              href="/tournament" 
              class="no-underline text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-sm font-medium cursor-pointer"
              data-link="tournament"
            >
              Local Tournament
            </a>
          </div>
          <button
            id="dark-mode-toggle"
            class="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            <svg id="sun-icon" class="w-5 h-5 ${isDark ? "hidden" : ""}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg id="moon-icon" class="w-5 h-5 ${isDark ? "" : "hidden"}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Add click handlers to prevent default and navigate
  const links = nav.querySelectorAll("a[data-link]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = (link as HTMLAnchorElement).href;
      if (href) {
        const url = new URL(href);
        navigate(url.pathname);
      }
    });
  });

  // Add dark mode toggle handler
  const toggleButton = nav.querySelector("#dark-mode-toggle");
  const sunIcon = nav.querySelector("#sun-icon");
  const moonIcon = nav.querySelector("#moon-icon");

  if (toggleButton && sunIcon && moonIcon) {
    toggleButton.addEventListener("click", () => {
      const currentDarkMode = getDarkMode();
      const newDarkMode = !currentDarkMode;
      setDarkMode(newDarkMode);

      // Update icons visibility
      if (newDarkMode) {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      } else {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      }
    });
  }

  return nav;
}
