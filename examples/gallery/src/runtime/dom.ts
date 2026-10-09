export const Fragment = "fragment";

export function h(
  type: unknown,
  props: Record<string, unknown> | null,
  ...children: unknown[]
): string {
  const inner = children
    .flat()
    .filter((child) => child != null && child !== false)
    .join("");
  if (type === Fragment) {
    return inner;
  }
  const name = String(type);
  const attrs = formatProps(props);
  if (name === "img") {
    return `<img${attrs}>`;
  }
  return `<${name}${attrs}>${inner}</${name}>`;
}

function formatProps(props: Record<string, unknown> | null): string {
  if (!props) {
    return "";
  }
  return Object.keys(props)
    .filter((key) => props[key] != null && props[key] !== false)
    .map((key) => {
      const attr = key === "className" ? "class" : key;
      const value = props[key];
      if (value === true) {
        return ` ${attr}`;
      }
      return ` ${attr}="${String(value)}"`;
    })
    .join("");
}
