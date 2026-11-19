import { LitElement, html, css, nothing } from "lit";
import { DragGesture } from "@use-gesture/vanilla";

import * as G from "./grid.js";
import { translations } from "./i18n.js";

const PANEL_PATH = "/schedule-editor";

const MOVE_TOLERANCE = 5; // px a press may move and still count as a tap
const HOLD_MS = 400; // touch: how long to hold before a gesture starts
const EDGE_PX = 9; // resize zone at the block edges (mouse)
const EDGE_PX_TOUCH = 16; // same for touch
const SLOT_PX = 28; // height of 30 minutes (mouse)
const SLOT_PX_TOUCH = 32; // same for touch
const AUTOSCROLL_ZONE = 56;
const AUTOSCROLL_MAX = 18; // px per frame
const GUTTER_PX = 48;
const MAX_HISTORY = 100;

const hasIcon = () => !!customElements.get("ha-icon");
const localeOf = (hass) => hass?.locale?.language || hass?.language || "en";

class ScheduleEditorPanel extends LitElement {
  static properties = {
    narrow: { type: Boolean },
    _status: { state: true },
    _error: { state: true },
    _schedules: { state: true },
    _entityId: { state: true },
    _days: { state: true },
    _savedJson: { state: true },
    _history: { state: true },
    _future: { state: true },
    _ghost: { state: true },
    _sheet: { state: true },
    _saving: { state: true },
    _toast: { state: true },
  };

  constructor() {
    super();
    this.narrow = false;
    this._hass = undefined;
    this._locale = "en";
    this._lang = "en";
    this._status = "loading"; // loading | ready | error
    this._error = "";
    this._schedules = null;
    this._entityId = null;
    this._days = null;
    this._savedJson = "";
    this._history = [];
    this._future = [];
    this._ghost = null;
    this._sheet = null;
    this._saving = false;
    this._toast = "";
    this._sheetOpenedAt = 0;

    this._loadStarted = false;
    this._scrolled = false;
    this._gridEl = null;
    this._gesture = null;
    this._op = null;
    this._startXY = [0, 0];
    this._lastXY = [0, 0];
    this._raf = 0;
    this._coarse = window.matchMedia("(pointer: coarse)").matches;

    // Day and minute under the pointer at the moment of the press. The gesture
    // library reports a drag only after it has started, so the press is recorded here.
    this._press = null;
    this._onPress = (e) => {
      if (this._gridEl) this._press = this._point(e.clientX, e.clientY);
    };

    this._onLocation = () => this._applyRoute();
    this._onKey = (e) => this._handleKey(e);
    this._onBeforeUnload = (e) => {
      if (this._dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    this._tick = () => this._autoScroll();
  }

  // Home Assistant sets `hass` on every state change. It is deliberately not a
  // reactive property, so the grid is not re-rendered for unrelated updates.
  set hass(value) {
    const first = !this._hass;
    const locale = localeOf(value);
    const changed = locale !== this._locale;
    this._hass = value;
    this._locale = locale;
    this._lang = locale.split("-")[0];
    if (first && this.isConnected) this._load();
    else if (changed) this.requestUpdate();
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("location-changed", this._onLocation);
    window.addEventListener("popstate", this._onLocation);
    window.addEventListener("keydown", this._onKey);
    window.addEventListener("beforeunload", this._onBeforeUnload);
    if (this._hass && !this._loadStarted) this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("location-changed", this._onLocation);
    window.removeEventListener("popstate", this._onLocation);
    window.removeEventListener("keydown", this._onKey);
    window.removeEventListener("beforeunload", this._onBeforeUnload);
    cancelAnimationFrame(this._raf);
    this._gesture?.destroy();
    this._gesture = null;
    this._gridEl?.removeEventListener("pointerdown", this._onPress, true);
    this._gridEl = null;
  }

  // ------------------------------------------------------------ state ----

  get _t() {
    return translations(this._lang);
  }

  get _slotH() {
    return this._coarse ? SLOT_PX_TOUCH : SLOT_PX;
  }

  get _dirty() {
    return !!this._days && JSON.stringify(G.toPayload(this._days)) !== this._savedJson;
  }

  get _scheduleName() {
    return this._schedules?.find((s) => s.entity_id === this._entityId)?.name ?? "";
  }

  async _load() {
    this._loadStarted = true;
    this._status = "loading";
    try {
      this._schedules = await this._hass.callWS({ type: "schedule_editor/list" });
      this._status = "ready";
      this._error = "";
      this._applyRoute(true);
    } catch (err) {
      this._status = "error";
      this._error = `${this._t.load_failed}: ${err?.message || err}`;
    }
  }

  _applyRoute(force = false) {
    if (!this._schedules || !window.location.pathname.startsWith(PANEL_PATH)) return;
    const wanted = new URLSearchParams(window.location.search).get("entity");
    if (!force && wanted === this._entityId) return;
    const item = wanted ? this._schedules.find((s) => s.entity_id === wanted) : null;
    this._entityId = wanted;
    this._days = item ? G.fromList(item) : null;
    this._savedJson = this._days ? JSON.stringify(G.toPayload(this._days)) : "";
    this._history = [];
    this._future = [];
    this._sheet = null;
    this._ghost = null;
    this._scrolled = false;
  }

  _navigate(path) {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  _select(entityId) {
    this._navigate(`${PANEL_PATH}?entity=${encodeURIComponent(entityId)}`);
  }

  _back() {
    if (this._dirty && !window.confirm(this._t.discard_confirm)) return;
    if (window.history.length > 1) window.history.back();
    else this._navigate(PANEL_PATH);
  }

  // ---------------------------------------------------- edits and history ----

  _commit(days) {
    this._history = [...this._history, this._days].slice(-MAX_HISTORY);
    this._future = [];
    this._days = days;
  }

  _undo() {
    if (!this._history.length) return;
    this._future = [this._days, ...this._future];
    this._days = this._history[this._history.length - 1];
    this._history = this._history.slice(0, -1);
  }

  _redo() {
    if (!this._future.length) return;
    this._history = [...this._history, this._days];
    this._days = this._future[0];
    this._future = this._future.slice(1);
  }

  async _save() {
    if (this._saving || !this._dirty) return;
    this._saving = true;
    this._error = "";
    const payload = G.toPayload(this._days);
    try {
      await this._hass.callWS({
        type: "schedule_editor/update",
        entity_id: this._entityId,
        ...payload,
      });
      this._savedJson = JSON.stringify(payload);
      this._showToast(this._t.saved);
    } catch (err) {
      this._error = `${this._t.save_failed}: ${err?.message || err}`;
    } finally {
      this._saving = false;
    }
  }

  _showToast(message) {
    this._toast = message;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this._toast = "";
    }, 2500);
  }

  _handleKey(e) {
    if (this._sheet) {
      if (e.key === "Escape") this._closeSheet();
      return;
    }
    if (!this._days) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    if (mod && !e.shiftKey && key === "z") {
      e.preventDefault();
      this._undo();
    } else if (mod && (key === "y" || (e.shiftKey && key === "z"))) {
      e.preventDefault();
      this._redo();
    }
  }

  // -------------------------------------------------------- gestures ----

  _gestureConfig() {
    const config = { filterTaps: true };
    if (this._coarse) {
      // Touch: nothing starts before a hold, so vertical scrolling stays natural.
      config.preventScroll = HOLD_MS;
      config.pointer = { touch: true };
    }
    return config;
  }

  /** Pointer position (client px) -> day index and minute within the day. */
  _point(x, y) {
    const rect = this._gridEl.getBoundingClientRect();
    const day = G.clamp(Math.floor(((x - rect.left) / rect.width) * 7), 0, 6);
    const minute = G.clamp(G.pxToMinute(y - rect.top, this._slotH), 0, G.DAY_MINUTES - 0.001);
    return { day, minute };
  }

  _onDrag(state) {
    // A quick press and release is reported once, with `tap` set and no first/last flags.
    if (state.tap) {
      this._beginOp(state.initial);
      const op = this._op;
      this._op = null;
      this._tap(op);
      return;
    }
    // `first` only arrives after the pointer already moved a few pixels:
    // the position of the press itself is `initial`.
    if (state.first) this._beginOp(state.initial);
    const op = this._op;
    if (!op) return;
    this._lastXY = state.xy;
    if (!op.moved) {
      const dist = Math.hypot(state.xy[0] - this._startXY[0], state.xy[1] - this._startXY[1]);
      if (dist > MOVE_TOLERANCE) {
        op.moved = true;
        this._raf = requestAnimationFrame(this._tick);
      }
    }
    if (op.moved && !state.last) this._updateGhost(op);
    if (state.last) this._endOp();
  }

  _beginOp(xy) {
    this._startXY = [xy[0], xy[1]];
    this._lastXY = this._startXY;
    const p = this._press ?? this._point(xy[0], xy[1]);
    const hit = G.hitTest(
      this._days[p.day],
      p.minute,
      this._slotH / G.SNAP,
      this._coarse ? EDGE_PX_TOUCH : EDGE_PX
    );
    const base = { day: p.day, anchor: p.minute, moved: false, hitId: hit?.block.id ?? null };
    if (!hit) this._op = { ...base, type: "create" };
    else if (hit.zone === "body") {
      this._op = { ...base, type: "move", id: hit.block.id, grab: p.minute - hit.block.from };
    } else this._op = { ...base, type: "resize", id: hit.block.id, edge: hit.zone };
  }

  _updateGhost(op) {
    if (!op) return;
    const p = this._point(this._lastXY[0], this._lastXY[1]);
    const blocks = this._days[op.day];
    if (op.type === "create") {
      const range = G.createRange(blocks, op.anchor, p.minute);
      this._ghost = range ? { kind: "create", day: op.day, ...range, valid: true } : null;
      return;
    }
    const block = blocks.find((b) => b.id === op.id);
    if (!block) return;
    if (op.type === "resize") {
      const range = G.resizeBlock(blocks, block, op.edge, p.minute);
      this._ghost = { kind: "resize", id: op.id, day: op.day, ...range, valid: true };
    } else {
      const moved = G.moveBlock(this._days, block, p.day, p.minute, op.grab);
      this._ghost = { kind: "move", id: op.id, ...moved };
    }
  }

  _endOp() {
    const op = this._op;
    this._op = null;
    cancelAnimationFrame(this._raf);
    this._raf = 0;
    if (!op) return;
    if (op.moved) this._finishDrag(op);
    else this._tap(op);
  }

  // Recompute from the final pointer position, then commit if the result is valid.
  _finishDrag(op) {
    this._updateGhost(op);
    const ghost = this._ghost;
    this._ghost = null;
    if (!ghost || !ghost.valid) return;

    if (ghost.kind === "create") {
      this._commit(G.addBlock(this._days, ghost.day, ghost.from, ghost.to));
      return;
    }
    const current = this._days[op.day].find((b) => b.id === op.id);
    if (!current) return;
    if (ghost.kind === "resize") {
      if (ghost.from === current.from && ghost.to === current.to) return;
      this._commit(G.updateBlock(this._days, ghost.day, ghost.id, ghost.from, ghost.to));
      return;
    }
    if (ghost.day === op.day && ghost.from === current.from && ghost.to === current.to) return;
    this._commit(G.relocateBlock(this._days, op.day, ghost.id, ghost.day, ghost.from, ghost.to));
  }

  // Press and release without moving: edit a block, or add a default block.
  _tap(op) {
    this._ghost = null;
    const blocks = this._days[op.day];
    if (op.hitId != null) {
      const block = blocks.find((b) => b.id === op.hitId);
      if (block) this._openSheet(op.day, block);
      return;
    }
    const range = G.createRange(blocks, op.anchor, op.anchor);
    if (range) this._commit(G.addBlock(this._days, op.day, range.from, range.to));
  }

  _autoScroll() {
    this._raf = 0;
    if (!this._op?.moved) return;
    const scroller = this.renderRoot.querySelector(".scroller");
    const head = this.renderRoot.querySelector(".head");
    if (scroller) {
      const rect = scroller.getBoundingClientRect();
      const top = rect.top + (head?.offsetHeight || 0) + AUTOSCROLL_ZONE;
      const bottom = rect.bottom - AUTOSCROLL_ZONE;
      const y = this._lastXY[1];
      let speed = 0;
      if (y < top) speed = -Math.min(1, (top - y) / AUTOSCROLL_ZONE) * AUTOSCROLL_MAX;
      else if (y > bottom) speed = Math.min(1, (y - bottom) / AUTOSCROLL_ZONE) * AUTOSCROLL_MAX;
      if (speed) {
        scroller.scrollTop += speed;
        this._updateGhost(this._op);
      }
    }
    this._raf = requestAnimationFrame(this._tick);
  }

  // -------------------------------------------------------- edit sheet ----

  _openSheet(day, block) {
    this._sheetOpenedAt = performance.now();
    this._sheet = {
      day,
      id: block.id,
      from: G.toInputValue(block.from),
      to: G.toInputValue(block.to),
      hasData: !!block.data,
      error: "",
    };
  }

  _closeSheet() {
    this._sheet = null;
  }

  // Touch devices may send a synthesized click right after the press that opened the
  // sheet; it would land on the backdrop and close the sheet again.
  _onBackdrop() {
    if (performance.now() - this._sheetOpenedAt < 450) return;
    this._closeSheet();
  }

  _sheetInput(field, e) {
    this._sheet = { ...this._sheet, [field]: e.target.value, error: "" };
  }

  _applySheet() {
    const s = this._sheet;
    const from = G.fromInputValue(s.from, false);
    const to = G.fromInputValue(s.to, true);
    const error = G.validateTimes(this._days[s.day], s.id, from, to);
    if (error) {
      this._sheet = { ...s, error: this._t[`err_${error}`] };
      return;
    }
    const current = this._days[s.day].find((b) => b.id === s.id);
    if (current && (current.from !== from || current.to !== to)) {
      this._commit(G.updateBlock(this._days, s.day, s.id, from, to));
    }
    this._sheet = null;
  }

  _deleteFromSheet() {
    const s = this._sheet;
    this._commit(G.removeBlock(this._days, s.day, s.id));
    this._sheet = null;
  }

  // ----------------------------------------------------------- render ----

  updated() {
    const grid = this.renderRoot.querySelector(".grid");
    if (grid !== this._gridEl) {
      this._gesture?.destroy();
      this._gesture = null;
      this._gridEl?.removeEventListener("pointerdown", this._onPress, true);
      this._gridEl = grid;
      if (grid) {
        grid.addEventListener("pointerdown", this._onPress, true);
        this._gesture = new DragGesture(grid, (state) => this._onDrag(state), this._gestureConfig());
      }
    }
    if (grid && !this._scrolled) {
      const scroller = this.renderRoot.querySelector(".scroller");
      if (scroller) {
        scroller.scrollTop = G.minuteToPx(6 * 60, this._slotH);
        this._scrolled = true;
      }
    }
  }

  _dayName(index, style) {
    return new Date(2024, 0, 1 + index).toLocaleDateString(this._locale, { weekday: style });
  }

  _btn({ icon, label, onClick, disabled = false, primary = false, iconOnly = false, glyph }) {
    const icons = hasIcon();
    const labelClass = iconOnly && icons ? "hidden" : icons ? "optional" : "";
    return html`<button
      class="btn ${primary ? "primary" : ""}"
      ?disabled=${disabled}
      title=${label}
      aria-label=${label}
      @click=${onClick}
    >
      ${icons ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
      <span class=${labelClass}>${icons ? label : (glyph ?? label)}</span>
    </button>`;
  }

  render() {
    const t = this._t;
    let body;
    if (this._status === "loading") {
      body = html`<p class="notice">${t.loading}</p>`;
    } else if (this._status === "error") {
      body = html`<p class="notice error">${this._error}</p>`;
    } else if (this._days) {
      body = this._renderEditor();
    } else if (this._entityId) {
      body = html`<div class="notice">
        <p>${t.not_found}</p>
        <button class="row" @click=${() => this._navigate(PANEL_PATH)}>${t.choose}</button>
      </div>`;
    } else {
      body = this._renderPicker();
    }

    return html`<div class="page">
      ${this._renderBar()}
      ${this._error && this._status === "ready"
        ? html`<div class="banner">
            <span>${this._error}</span>
            <button class="btn" @click=${() => (this._error = "")}>×</button>
          </div>`
        : nothing}
      ${body} ${this._sheet ? this._renderSheet() : nothing}
      ${this._toast ? html`<div class="toast">${this._toast}</div>` : nothing}
    </div>`;
  }

  _renderBar() {
    const t = this._t;
    const editing = !!this._days;
    return html`<header class="bar">
      ${editing
        ? this._btn({ icon: "mdi:arrow-left", label: t.back, onClick: this._back, iconOnly: true, glyph: "←" })
        : customElements.get("ha-menu-button")
          ? html`<ha-menu-button .hass=${this._hass} .narrow=${this.narrow}></ha-menu-button>`
          : nothing}
      <div class="title">
        <span>${editing ? this._scheduleName : t.title}</span>
        ${editing && this._dirty ? html`<span class="dot" title=${t.unsaved}></span>` : nothing}
      </div>
      ${editing
        ? html`
            ${this._btn({ icon: "mdi:undo", label: t.undo, onClick: this._undo, disabled: !this._history.length })}
            ${this._btn({ icon: "mdi:redo", label: t.redo, onClick: this._redo, disabled: !this._future.length })}
            ${this._btn({
              icon: "mdi:content-save",
              label: this._saving ? t.saving : t.save,
              onClick: this._save,
              disabled: !this._dirty || this._saving,
              primary: true,
            })}
          `
        : nothing}
    </header>`;
  }

  _renderPicker() {
    const t = this._t;
    if (!this._schedules.length) return html`<p class="notice">${t.none}</p>`;
    return html`<div class="picker">
      ${this._schedules.map(
        (s) => html`<button class="row" @click=${() => this._select(s.entity_id)}>
          ${hasIcon() ? html`<ha-icon icon=${s.icon || "mdi:calendar-clock"}></ha-icon>` : nothing}
          <span>${s.name}</span>
        </button>`
      )}
    </div>`;
  }

  _renderEditor() {
    const slotH = this._slotH;
    const wide = !this.narrow;
    const today = (new Date().getDay() + 6) % 7;
    const names = [0, 1, 2, 3, 4, 5, 6].map((i) => this._dayName(i, wide ? "long" : "short"));
    return html`<div class="scroller" style="--slot-h:${slotH}px; --gutter:${GUTTER_PX}px">
      <div class="head">
        <div></div>
        ${names.map((name, i) => html`<div class="dayname ${i === today ? "today" : ""}">${name}</div>`)}
      </div>
      <div class="body">
        <div class="gutter">
          ${Array.from({ length: 23 }, (_, k) => k + 1).map(
            (h) => html`<span style="top:${h * 2 * slotH}px">${G.formatHM(h * 60)}</span>`
          )}
        </div>
        <div class="grid" @contextmenu=${(e) => e.preventDefault()}>
          ${this._days.map(
            (blocks, d) => html`<div class="col ${d === today ? "today" : ""}">
              ${blocks.map((b) => this._renderBlock(b))}
              ${this._ghost && this._ghost.day === d ? this._renderGhost(this._ghost) : nothing}
            </div>`
          )}
        </div>
      </div>
    </div>`;
  }

  _blockStyle(from, to) {
    const slotH = this._slotH;
    const top = G.minuteToPx(from, slotH) + 1;
    const height = Math.max(G.minuteToPx(to - from, slotH) - 2, 4);
    return `top:${top}px;height:${height}px`;
  }

  _timeLabel(from, to) {
    return html`<span class="time"><span>${G.formatHM(from)}</span><span>${G.formatHM(to)}</span></span>`;
  }

  _renderBlock(block) {
    const source = this._ghost && this._ghost.id === block.id;
    return html`<div class="block ${source ? "source" : ""}" style=${this._blockStyle(block.from, block.to)}>
      ${this._timeLabel(block.from, block.to)}
    </div>`;
  }

  _renderGhost(ghost) {
    return html`<div class="block ghost ${ghost.valid ? "" : "invalid"}" style=${this._blockStyle(ghost.from, ghost.to)}>
      ${this._timeLabel(ghost.from, ghost.to)}
    </div>`;
  }

  _renderSheet() {
    const s = this._sheet;
    const t = this._t;
    return html`<div class="backdrop" @click=${this._onBackdrop}>
      <div class="sheet" role="dialog" aria-modal="true" @click=${(e) => e.stopPropagation()}>
        <h2>${t.edit_block} · ${this._dayName(s.day, "long")}</h2>
        <div class="fields">
          <label
            >${t.from}
            <input type="time" .value=${s.from} @input=${(e) => this._sheetInput("from", e)} />
          </label>
          <label
            >${t.to}
            <input type="time" .value=${s.to} @input=${(e) => this._sheetInput("to", e)} />
          </label>
        </div>
        <p class="hint">${t.end_hint}</p>
        ${s.hasData ? html`<p class="hint">${t.has_data}</p>` : nothing}
        ${s.error ? html`<p class="hint error">${s.error}</p>` : nothing}
        <div class="actions">
          <button class="sheet-btn danger" @click=${this._deleteFromSheet}>${t.delete}</button>
          <span class="spacer"></span>
          <button class="sheet-btn" @click=${this._closeSheet}>${t.cancel}</button>
          <button class="sheet-btn primary" @click=${this._applySheet}>${t.apply}</button>
        </div>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      height: 100dvh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, Noto, sans-serif);
      -webkit-tap-highlight-color: transparent;
    }
    .page {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      position: relative;
    }

    /* top bar */
    .bar {
      flex: none;
      display: flex;
      align-items: center;
      gap: 4px;
      height: 56px;
      padding: 0 8px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
    }
    .title {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      font-size: 20px;
    }
    .title span:first-child {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--warning-color, #ffa600);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 40px;
      padding: 0 10px;
      border: 0;
      border-radius: 20px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .btn:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.18);
    }
    .btn[disabled] {
      opacity: 0.4;
      cursor: default;
    }
    .btn.primary {
      background: var(--app-header-text-color, var(--text-primary-color, #fff));
      color: var(--app-header-background-color, var(--primary-color));
    }
    .btn .optional {
      display: none;
    }
    .btn .hidden {
      display: none;
    }
    @media (min-width: 700px) {
      .btn .optional {
        display: inline;
      }
    }
    ha-icon {
      --mdc-icon-size: 22px;
      display: inline-flex;
    }

    .banner {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 4px 8px 4px 16px;
      background: var(--error-color, #db4437);
      color: #fff;
      font-size: 14px;
    }
    .notice {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .notice.error {
      color: var(--error-color, #db4437);
    }

    /* picker */
    .picker {
      width: 100%;
      max-width: 560px;
      margin: 16px auto;
      padding: 0 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
      font-size: 16px;
      text-align: left;
      cursor: pointer;
    }
    .row:hover {
      border-color: var(--primary-color);
    }

    /* week grid */
    .scroller {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      background: var(--card-background-color);
    }
    .head {
      position: sticky;
      top: 0;
      z-index: 3;
      display: grid;
      grid-template-columns: var(--gutter) repeat(7, minmax(0, 1fr));
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
    }
    .dayname {
      padding: 10px 2px;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dayname.today {
      color: var(--primary-color);
      font-weight: 700;
    }
    .body {
      display: flex;
      position: relative;
      height: calc(48 * var(--slot-h));
      user-select: none;
      -webkit-user-select: none;
    }
    .gutter {
      position: relative;
      flex: none;
      width: var(--gutter);
    }
    .gutter span {
      position: absolute;
      right: 6px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .grid {
      flex: 1;
      min-width: 0;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      touch-action: pan-y;
      background-image:
        linear-gradient(var(--divider-color) 1px, transparent 1px),
        linear-gradient(color-mix(in srgb, var(--divider-color) 45%, transparent) 1px, transparent 1px);
      background-size:
        100% calc(var(--slot-h) * 2),
        100% var(--slot-h);
    }
    .col {
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.today {
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
    }
    .block {
      position: absolute;
      left: 2px;
      right: 2px;
      box-sizing: border-box;
      padding: 2px 4px;
      overflow: hidden;
      border-radius: 6px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 11px;
      line-height: 1.25;
      cursor: grab;
      --edge: min(9px, 33.3%);
    }
    @media (pointer: coarse) {
      .block {
        --edge: min(16px, 33.3%);
      }
    }
    .block::before,
    .block::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: var(--edge);
      cursor: ns-resize;
    }
    .block::before {
      top: 0;
    }
    .block::after {
      bottom: 0;
    }
    .block.source {
      opacity: 0.25;
    }
    .block.ghost {
      z-index: 2;
      pointer-events: none;
      opacity: 0.9;
      outline: 2px solid var(--text-primary-color, #fff);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }
    .block.ghost.invalid {
      background: var(--error-color, #db4437);
    }
    .time {
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }
    @media (min-width: 900px) {
      .time {
        flex-direction: row;
        gap: 0.25em;
      }
      .time span:first-child::after {
        content: " –";
      }
    }

    /* edit sheet */
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
    }
    .sheet {
      box-sizing: border-box;
      width: min(420px, 92vw);
      padding: 16px 20px;
      border-radius: 12px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }
    .sheet h2 {
      margin: 0 0 12px;
      font-size: 18px;
      font-weight: 500;
    }
    .fields {
      display: flex;
      gap: 12px;
    }
    .fields label {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .fields input {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 16px;
    }
    .hint {
      margin: 10px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .hint.error {
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
    }
    .spacer {
      flex: 1;
    }
    .sheet-btn {
      padding: 10px 16px;
      border: 1px solid var(--divider-color);
      border-radius: 20px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .sheet-btn.primary {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .sheet-btn.danger {
      color: var(--error-color, #db4437);
    }
    @media (max-width: 600px) {
      .backdrop {
        align-items: flex-end;
      }
      .sheet {
        width: 100%;
        border-radius: 16px 16px 0 0;
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
      }
    }

    .toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 11;
      padding: 10px 18px;
      border-radius: 20px;
      background: var(--primary-text-color);
      color: var(--card-background-color);
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  `;
}

if (!customElements.get("schedule-editor-panel")) {
  customElements.define("schedule-editor-panel", ScheduleEditorPanel);
}
