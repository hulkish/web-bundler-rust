import React from "react";
import { Frame, bind, fire } from "../kit.jsx";
import { city } from "./city.js";
import { portrait } from "./portrait.js";
import { galaxy, glass, loom, orrery, yard } from "./scenes.js";
import { createStage } from "./stage.js";

function View(props) {
  const host = React.useRef(null);
  const action = React.useRef(props.onAction);
  action.current = props.onAction;
  const build = props.build;
  const rows = props.rows;
  const tone = props.tone;
  const label = props.label;
  React.useEffect(function () {
    const node = host.current;
    if (!node) return undefined;
    const canvas = document.createElement("canvas");
    node.appendChild(canvas);
    const stage = createStage(canvas);
    stage.controls.addEventListener("end", function () {
      fire({ onAction: action.current, label: label }, "orbit", { row: label });
    });
    stage.show(function (api) {
      return build(api, { rows: rows, tone: tone, label: label });
    });
    stage.start();
    const observer = new ResizeObserver(function () { stage.resize(); });
    observer.observe(node);
    return function () {
      observer.disconnect();
      stage.stop();
      if (canvas.parentNode === node) node.removeChild(canvas);
    };
  }, [build, rows, tone, label]);
  const frame = props.density === "dense" ? " is-dense" : props.frame === "tall" ? " is-tall" : "";
  return <div className={"ui-three" + frame} ref={host} />;
}

function Scene(props) {
  return (
    <Frame {...props}>
      <View {...props} />
      {props.query ? <p className="ui-note">{props.query}</p> : null}
    </Frame>
  );
}

export function Portrait(props) {
  return <Scene {...props} build={portrait} />;
}

export function City(props) {
  return <Scene {...props} build={city} frame="tall" />;
}

export function MilkyWay(props) {
  return <Scene {...props} build={galaxy} />;
}

export function Orrery(props) {
  return <Scene {...props} build={orrery} />;
}

export function Yard(props) {
  return <Scene {...props} build={yard} />;
}

export function Glass(props) {
  return <Scene {...props} build={glass} />;
}

export function Loom(props) {
  return <Scene {...props} build={loom} />;
}

bind("three", "Three", [
  [Portrait, "three-portrait", "Portrait", "A stylized 3D likeness of the photo: buzzed hair, beard, and green shirt, dancing hip hop in the backyard. Drag the canvas to orbit. The row count adds trees along the back fence.", ["Portrait", "Beard", "Shirt", "Backyard"], 4, "ink"],
  [City, "three-city", "City", "A city half as wide and half as deep as the old five-downtown map. Each visit lays a gentle roll of hills and a river, then reshuffles about a hundred building programs into new rows, courts, towers, roofs, colors, and districts: sacred courts, markets, campuses, works, harbors, old lanes, gardens, and a skyline. Avenues run north to south and numbered streets run east to west, one-way in alternating directions, with a two-way crosstown every few blocks, one diagonal broadway, and a long rectangular park. Streets stop at the banks. A drive follows each shore, and the few bridges that cross arch perpendicular to the river. Avenues, crosstown streets, and those drives each post a speed limit, and cars, buses, and emergency vehicles stay within it. Drifting clouds sit over the roofs. Scroll or pinch to zoom, drag to look around, and fly with W A S D along the view. Q and E climb and descend, and Shift flies faster. Thousands of people fill the streets and parks, and each role moves through its own routine. Couriers pick up and drop off, workers take a shift then lunch, criminals case a mark then stalk, snatch, and hide. Joggers alternate easy laps and sprints. Parks and plazas share a clock: singers bow and mingle, dancers spin and pose, players huddle and sit out, listeners clap, picnickers stroll, painters step back, and rallies chant then march. Some officers hunt a criminal while others walk a beat. Firefighters and fire trucks work street fires, and helicopters circle above the roofs. Cars, buses, and ambulances follow the roads. The row count scales the districts and the crowds.", ["City", "Police", "Firefighter", "Helicopter", "One-way"], 12, "sea"],
  [MilkyWay, "three-milky-way", "Milky Way", "A barred spiral galaxy: bulge, bar, four arms, and a dust lane. The row count sets how many stars are drawn. Drag the canvas to orbit.", ["Galaxy", "Bulge", "Spiral", "Stars"], 8, "ink"],
  [Orrery, "three-orrery", "Orrery", "A Three.js orrery. The row count is the number of planets. Drag the canvas to orbit.", ["Planet", "Sun", "Orbit"], 4, "gold"],
  [Yard, "three-yard", "Yard", "An instanced grid of posts and a moving crane. The row count is the length of each side.", ["Post", "Crane", "Shadow"], 8, "ink"],
  [Glass, "three-glass", "Glass", "A shader displaces an icosahedron. The row count raises the mesh detail.", ["Shader", "Icosahedron"], 3, "sea"],
  [Loom, "three-loom", "Loom", "A tube follows a curve and a shuttle rides it. The row count is the number of posts.", ["Curve", "Shuttle", "Tube"], 5, "clay"],
]);
