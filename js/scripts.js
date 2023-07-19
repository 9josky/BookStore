import { UI } from "./UI.js";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", UI.ready);
}else {
    UI.ready();
  }