import type {
  Circle,
  GradientStop,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rectangle,
} from "../core/types";

export function circle(element: Circle): string {
  return [
    "<circle",
    ` cx="${element.cx}"`,
    ` cy="${element.cy}"`,
    ` r="${element.radius}"`,
    attribute("fill", element.fill),
    attribute("opacity", element.opacity),
    attribute("stroke", element.stroke),
    attribute("stroke-width", element.strokeWidth),
    " />",
  ].join("");
}

export function rectangle(element: Rectangle): string {
  return [
    "<rect",
    ` x="${element.x}"`,
    ` y="${element.y}"`,
    ` width="${element.width}"`,
    ` height="${element.height}"`,
    attribute("fill", element.fill),
    attribute("opacity", element.opacity),
    attribute("stroke", element.stroke),
    attribute("stroke-width", element.strokeWidth),
    " />",
  ].join("");
}

export function polygon(element: Polygon): string {
  const points = element.points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return [
    "<polygon",
    ` points="${points}"`,
    attribute("fill", element.fill),
    attribute("opacity", element.opacity),
    attribute("stroke", element.stroke),
    attribute("stroke-width", element.strokeWidth),
    " />",
  ].join("");
}

export function line(element: Line): string {
  return [
    "<line",
    ` x1="${element.x1}"`,
    ` y1="${element.y1}"`,
    ` x2="${element.x2}"`,
    ` y2="${element.y2}"`,
    attribute("opacity", element.opacity),
    attribute("stroke", element.stroke),
    attribute("stroke-width", element.strokeWidth),
    " />",
  ].join("");
}

export function path(element: Path): string {
  return [
    "<path",
    ` d="${escapeAttribute(element.d)}"`,
    attribute("fill", element.fill),
    attribute("opacity", element.opacity),
    attribute("stroke", element.stroke),
    attribute("stroke-width", element.strokeWidth),
    " />",
  ].join("");
}

export function linearGradient(element: LinearGradient): string {
  return [
    "<linearGradient",
    ` id="${escapeAttribute(element.id)}"`,
    ` x1="${percentage(element.x1)}"`,
    ` y1="${percentage(element.y1)}"`,
    ` x2="${percentage(element.x2)}"`,
    ` y2="${percentage(element.y2)}"`,
    ">",
    element.stops.map(gradientStop).join(""),
    "</linearGradient>",
  ].join("");
}

export function radialGradient(element: RadialGradient): string {
  return [
    "<radialGradient",
    ` id="${escapeAttribute(element.id)}"`,
    ` cx="${percentage(element.cx)}"`,
    ` cy="${percentage(element.cy)}"`,
    ` r="${percentage(element.radius)}"`,
    ">",
    element.stops.map(gradientStop).join(""),
    "</radialGradient>",
  ].join("");
}

function gradientStop(stop: GradientStop): string {
  return [
    "<stop",
    ` offset="${percentage(stop.offset)}"`,
    ` stop-color="${escapeAttribute(stop.color)}"`,
    " />",
  ].join("");
}

function percentage(value: number): string {
  return `${value * 100}%`;
}

function attribute(
  name: string,
  value: string | number | undefined,
): string {
  if (value === undefined) {
    return "";
  }

  return ` ${name}="${escapeAttribute(String(value))}"`;
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}