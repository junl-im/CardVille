/* CardVille v0.4 provisional goal calibration.
 * Does not destroy original stage configuration; applies a conservative beta cap.
 * Monte Carlo outcome sampling and future telemetry should replace heuristic caps.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CardVilleBalance = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const SCORE_PER_MOVE = Object.freeze({3: 210, 4: 185, 5: 170, 6: 155, 7: 150});
  function adjustedGoal(lv) {
    if (!lv || !Number.isFinite(lv.goal) || !Number.isFinite(lv.moves)) throw new TypeError('Invalid level');
    const baseline = SCORE_PER_MOVE[lv.colors];
    if (!baseline || lv.moves < 1 || lv.moves > 100 || lv.goal < 1) throw new RangeError('Invalid level values');
    const locks = Math.max(0, Math.min(64, Number(lv.lockedCount) || 0));
    const cap = Math.round(lv.moves * baseline * (1 + locks / 64) * (lv.isBoss ? 1.2 : 1));
    return Math.min(lv.goal, Math.max(250, cap));
  }
  function apply(levels) {
    if (!Array.isArray(levels) || levels.length === 0) throw new TypeError('Levels not available');
    return levels.map((lv) => {
      if (!Object.prototype.hasOwnProperty.call(lv, 'originalGoal')) lv.originalGoal = lv.goal;
      lv.goal = adjustedGoal({...lv, goal: lv.originalGoal});
      return {id:lv.l,old:lv.originalGoal,current:lv.goal,changed:lv.goal!==lv.originalGoal};
    });
  }
  return {adjustedGoal, apply, SCORE_PER_MOVE};
});
