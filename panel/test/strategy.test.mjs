import test from "node:test";
import assert from "node:assert/strict";

// strategy.js registers a custom element; provide minimal stand-ins for node.
globalThis.HTMLElement ??= class {};
globalThis.customElements ??= { get: () => undefined, define: () => {} };
const { buildDashboard, viewPath } = await import("../src/strategy.js");

test("view path is the object id", () => {
  assert.equal(viewPath("schedule.heating_office"), "heating_office");
});

test("one subview per schedule after the overview", () => {
  const config = buildDashboard(
    [
      { entity_id: "schedule.heating", name: "Heating", icon: "mdi:radiator" },
      { entity_id: "schedule.light", name: "Light", icon: null },
    ],
    "en"
  );
  assert.equal(config.views.length, 3);
  assert.equal(config.views[0].path, "overview");
  assert.equal(config.views[0].cards[0].tap_action.navigation_path, "/schedule-editor/heating");
  const [, heating, light] = config.views;
  assert.deepEqual(
    [heating.path, heating.subview, heating.type, heating.cards[0].entity],
    ["heating", true, "panel", "schedule.heating"]
  );
  assert.equal(light.icon, "mdi:calendar-clock");
});

test("overview explains an empty setup", () => {
  const config = buildDashboard([], "de");
  assert.equal(config.views.length, 1);
  assert.equal(config.views[0].cards[0].type, "markdown");
  assert.equal(config.title, "Zeitpläne");
});
