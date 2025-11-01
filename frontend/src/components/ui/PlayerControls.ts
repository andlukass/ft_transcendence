export interface PlayerControlsProps {
  leftButtonId: string;
  rightButtonId: string;
  onLeftClick: () => void;
  onRightClick: () => void;
  className?: string;
  innerClassName?: string;
}

export function PlayerControls({
  leftButtonId,
  rightButtonId,
  onLeftClick,
  onRightClick,
  className = "",
  innerClassName = "",
}: PlayerControlsProps): HTMLElement {
  const container = document.createElement("div");
  container.className = `text-center text-gray-600 ${className}`.trim();

  container.innerHTML = `
    <div class="bg-white p-2 rounded-lg shadow-md max-w-md mx-auto ${innerClassName.trim()}">
      <div class="flex gap-4">
        <button
          id="${leftButtonId}"
          class="w-[130px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors cursor-pointer"
        >
          ← Left
        </button>
        <button
          id="${rightButtonId}"
          class="w-[130px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors cursor-pointer"
        >
          Right →
        </button>
      </div>
    </div>
  `;

  // Add event listeners
  const leftBtn = container.querySelector(`#${leftButtonId}`) as HTMLButtonElement;
  const rightBtn = container.querySelector(`#${rightButtonId}`) as HTMLButtonElement;

  if (leftBtn) {
    leftBtn.addEventListener("click", onLeftClick);
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", onRightClick);
  }

  return container;
}
