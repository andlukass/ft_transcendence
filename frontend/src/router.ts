export type RouteHandler = () => HTMLElement;

const routes = new Map<string, RouteHandler>();

export function registerRoute(path: string, handler: RouteHandler) {
  routes.set(path, handler);
}

export function navigate(path: string) {
  history.pushState(null, "", path);
  render();
}

function notFound(): HTMLElement {
  const div = document.createElement("div");
  div.className = "text-center py-12";
  div.innerHTML = `
    <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p class="text-lg text-gray-600 mb-8">Page not found</p>
    <button 
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      id="go-home-btn"
    >
      Go Home
    </button>
  `;

  const btn = div.querySelector("#go-home-btn") as HTMLButtonElement;
  if (btn) {
    btn.addEventListener("click", () => navigate("/"));
  }

  return div;
}

export function render() {
  const app = document.getElementById("app");
  if (!app) {
    console.error("App element not found");
    return;
  }

  const handler = routes.get(location.pathname) || notFound;
  const content = handler();

  app.innerHTML = "";
  app.appendChild(content);
}

export function init() {
  render();

  window.addEventListener("popstate", () => {
    render();
  });
}
