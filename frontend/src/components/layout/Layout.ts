import { Topbar } from "../topbar/Topbar";

export function Layout(content: HTMLElement): HTMLElement {
  const main = document.createElement("main");
  main.className = "max-w-7xl mx-auto py-3 sm:py-6 sm:px-6 lg:px-8";

  const topbar = Topbar();
  main.appendChild(topbar);
  main.appendChild(content);

  return main;
}
