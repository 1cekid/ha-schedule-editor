import { translations } from "./i18n.js";

/** View path of a schedule: its object id, e.g. schedule.heating -> "heating". */
export const viewPath = (entityId) => entityId.split(".")[1];

/**
 * Builds the dashboard config: an overview with one tile per schedule and one
 * subview per schedule, reachable at /schedule-editor/<object_id>.
 */
export function buildDashboard(schedules, lang) {
  const t = translations(lang);
  const overview = {
    title: t.title,
    path: "overview",
    icon: "mdi:calendar-clock",
    cards: schedules.length
      ? schedules.map((s) => ({
          type: "tile",
          entity: s.entity_id,
          name: s.name,
          tap_action: { action: "navigate", navigation_path: `/schedule-editor/${viewPath(s.entity_id)}` },
          icon_tap_action: { action: "navigate", navigation_path: `/schedule-editor/${viewPath(s.entity_id)}` },
        }))
      : [{ type: "markdown", content: t.none }],
  };
  const views = schedules.map((s) => ({
    title: s.name,
    path: viewPath(s.entity_id),
    icon: s.icon || "mdi:calendar-clock",
    subview: true,
    type: "panel",
    cards: [{ type: "custom:schedule-editor-card", entity: s.entity_id }],
  }));
  return { title: t.title, views: [overview, ...views] };
}

class ScheduleEditorStrategy extends HTMLElement {
  static async generate(_config, hass) {
    const lang = (hass.locale?.language || hass.language || "en").split("-")[0];
    let schedules = [];
    try {
      schedules = await hass.callWS({ type: "schedule_editor/list" });
    } catch (err) {
      const t = translations(lang);
      return {
        title: t.title,
        views: [{ title: t.title, cards: [{ type: "markdown", content: `${t.load_failed}: ${err?.message || err}` }] }],
      };
    }
    return buildDashboard(schedules, lang);
  }
}

if (!customElements.get("ll-strategy-dashboard-schedule-editor")) {
  customElements.define("ll-strategy-dashboard-schedule-editor", ScheduleEditorStrategy);
}
