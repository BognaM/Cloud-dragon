// A copy of the cloud-dragon icon (the <symbol id="cloud-dragon"> in index.html).

const SVG = "http://www.w3.org/2000/svg";

export function dragonIcon() {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS(SVG, "use");
  use.setAttribute("href", "#cloud-dragon");
  svg.appendChild(use);
  return svg;
}
