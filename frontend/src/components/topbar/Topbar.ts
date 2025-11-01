import { navigate } from "../../router";

export function Topbar(): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "shadow-sm border-b border-gray-200";

  nav.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:justify-between h-fit py-0 max-sm:mb-3 sm:py-4 max-sm:gap-2">
        <div class="shrink-0 flex items-center max-sm:justify-center">
          <a 
            href="/" 
            class="gap-2 no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium cursor-pointer"
            data-link="home"
          >
            <img src="/pong.svg" alt="The Pong Game" class="w-6 h-6" />
            <h1 class="text-xl font-semibold text-gray-900">The Pong Game</h1>
          </a>
        </div>
        <div class="ml-6 flex space-x-8 text-center">
          <a 
            href="/match" 
            class="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium cursor-pointer"
            data-link="match"
          >
            Local Match
          </a>
          <a 
            href="/match" 
            class="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium cursor-pointer"
            data-link="match"
          >
            Remote Match
          </a>
          <a 
            href="/tournament" 
            class="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium cursor-pointer"
            data-link="tournament"
          >
            Local Tournament
          </a>
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

  return nav;
}
