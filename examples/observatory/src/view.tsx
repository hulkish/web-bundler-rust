import { Fragment, h } from "./runtime/dom.ts";
import type { Card } from "./types.ts";

export function renderCard(card: Card): string {
  const extra = { "data-nights": String(card.nights) };
  const badge = card.nights > 10 ? "long" : "short";
  return (
    <>
      <header className="card-head">{card.title}</header>
      <p className={card.band}>
        {card.summary}
        <em>{badge}</em>
      </p>
      <img src={card.mark} alt="mark" {...extra} />
    </>
  );
}

export function unusedPoster(title: string): string {
  return `UNUSED_POSTER:${title}`;
}
