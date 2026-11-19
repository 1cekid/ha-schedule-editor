import test from "node:test";
import assert from "node:assert/strict";

import * as G from "../src/grid.js";

const block = (id, from, to) => ({ id, from, to });

test("time conversion handles the end of the day", () => {
  assert.equal(G.parseTime("07:30:00"), 450);
  assert.equal(G.parseTime("24:00:00"), 1440);
  assert.equal(G.formatTime(1440), "24:00:00");
  assert.equal(G.formatTime(450), "07:30:00");
  assert.equal(G.toInputValue(1440), "00:00");
  assert.equal(G.fromInputValue("00:00", true), 1440);
  assert.equal(G.fromInputValue("00:00", false), 0);
  assert.ok(Number.isNaN(G.fromInputValue("", false)));
});

test("fromList / toPayload round trip keeps data and sorts blocks", () => {
  const item = {
    monday: [
      { from: "18:00:00", to: "24:00:00" },
      { from: "06:30:00", to: "08:00:00", data: { temp: 21 } },
    ],
    sunday: [{ from: "00:00:00", to: "24:00:00" }],
  };
  const days = G.fromList(item);
  assert.equal(days.length, 7);
  assert.deepEqual(
    days[0].map((b) => [b.from, b.to]),
    [
      [390, 480],
      [1080, 1440],
    ]
  );
  const payload = G.toPayload(days);
  assert.deepEqual(payload.monday, [
    { from: "06:30:00", to: "08:00:00", data: { temp: 21 } },
    { from: "18:00:00", to: "24:00:00" },
  ]);
  assert.deepEqual(payload.tuesday, []);
  assert.deepEqual(payload.sunday, [{ from: "00:00:00", to: "24:00:00" }]);
});

test("snapping", () => {
  assert.equal(G.snapMin(44), 30);
  assert.equal(G.snapMin(46), 60);
  assert.equal(G.floorSnap(59), 30);
});

test("createRange covers one slot on a tap and grows with the drag", () => {
  assert.deepEqual(G.createRange([], 430, 430), { from: 420, to: 450 });
  assert.deepEqual(G.createRange([], 430, 580), { from: 420, to: 600 });
  assert.deepEqual(G.createRange([], 430, 300), { from: 300, to: 450 });
});

test("createRange stops at neighbouring blocks", () => {
  const blocks = [block(1, 360, 420), block(2, 600, 660)];
  assert.deepEqual(G.createRange(blocks, 430, 640), { from: 420, to: 600 });
  assert.deepEqual(G.createRange(blocks, 430, 200), { from: 420, to: 450 });
});

test("hitTest zones", () => {
  const blocks = [block(1, 480, 540)];
  const ppm = 28 / 30;
  assert.equal(G.hitTest(blocks, 482, ppm, 10).zone, "start");
  assert.equal(G.hitTest(blocks, 538, ppm, 10).zone, "end");
  assert.equal(G.hitTest(blocks, 510, ppm, 10).zone, "body");
  assert.equal(G.hitTest(blocks, 545, ppm, 10), null);
  // a 30 minute block keeps a usable middle
  const short = [block(2, 600, 630)];
  assert.equal(G.hitTest(short, 615, ppm, 10).zone, "body");
});

test("resizeBlock snaps and stops at neighbours and minimum length", () => {
  const blocks = [block(1, 360, 420), block(2, 480, 540), block(3, 600, 660)];
  const b = blocks[1];
  assert.deepEqual(G.resizeBlock(blocks, b, "start", 400), { from: 420, to: 540 });
  assert.deepEqual(G.resizeBlock(blocks, b, "start", 445), { from: 450, to: 540 });
  assert.deepEqual(G.resizeBlock(blocks, b, "start", 530), { from: 510, to: 540 });
  assert.deepEqual(G.resizeBlock(blocks, b, "end", 700), { from: 480, to: 600 });
  assert.deepEqual(G.resizeBlock(blocks, b, "end", 481), { from: 480, to: 510 });
});

test("moveBlock: only the final position has to be free", () => {
  const days = [[block(1, 360, 420), block(2, 480, 540)], [], [], [], [], [], []];
  const b = days[0][1];
  const grab = 10;
  assert.equal(G.moveBlock(days, b, 0, 365, grab).valid, false); // on top of block 1
  const beyond = G.moveBlock(days, b, 0, 250, grab); // other side of block 1
  assert.equal(beyond.valid, true);
  assert.deepEqual([beyond.from, beyond.to], [240, 300]);
  assert.equal(G.moveBlock(days, b, 0, 440, grab).valid, true); // back to its own gap
  const clamped = G.moveBlock(days, b, 3, 2000, grab);
  assert.deepEqual([clamped.day, clamped.from, clamped.to, clamped.valid], [3, 1380, 1440, true]);
});

test("validateTimes", () => {
  const blocks = [block(1, 360, 420), block(2, 480, 540)];
  assert.equal(G.validateTimes(blocks, 2, 450, 540), null);
  assert.equal(G.validateTimes(blocks, 2, 400, 540), "overlap");
  assert.equal(G.validateTimes(blocks, 2, 540, 480), "order");
  assert.equal(G.validateTimes(blocks, 2, NaN, 480), "invalid");
});

test("edits are immutable and keep days sorted", () => {
  const days = G.fromList({ monday: [{ from: "08:00:00", to: "09:00:00" }] });
  const added = G.addBlock(days, 0, 360, 420);
  assert.equal(days[0].length, 1);
  assert.deepEqual(
    added[0].map((b) => b.from),
    [360, 480]
  );
  const id = added[0][1].id;
  const moved = G.relocateBlock(added, 0, id, 2, 600, 660);
  assert.equal(moved[0].length, 1);
  assert.deepEqual([moved[2][0].from, moved[2][0].to], [600, 660]);
  assert.equal(G.removeBlock(moved, 2, id)[2].length, 0);
  assert.equal(G.updateBlock(moved, 2, id, 610, 650)[2][0].from, 610);
});
