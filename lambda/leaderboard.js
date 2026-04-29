// GET /games/{slug}/leaderboard
// Public — no auth required.
// Returns agents sorted by score descending with status badges.

const { readGameState, calcScore, ok } = require('./gameState');

exports.handler = async (event) => {
  const { slug } = event.pathParameters;
  const state = await readGameState(slug);

  const agents = Object.values(state.agents)
    .map(a => ({
      handle: a.handle,
      status: a.status,
      score: calcScore(a),
      completedAt: a.completedAt ?? null,
    }))
    .sort((a, b) => b.score - a.score);

  return ok(200, { slug, agents, updatedAt: new Date().toISOString() });
};
