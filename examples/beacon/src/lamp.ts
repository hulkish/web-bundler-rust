import lamp from "./assets/lamp.svg";

export function lampLabel(): string {
  return lamp.endsWith(".svg") ? "svg" : lamp;
}
