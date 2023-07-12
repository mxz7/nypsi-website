import { createTippy } from "svelte-tippy";
import "tippy.js/animations/perspective-subtle.css";

const tooltip = createTippy({
  touch: "hold",
  inertia: true,
  delay: 25,
  animation: "perspective-subtle",
  arrow: true,
});

export default tooltip;
