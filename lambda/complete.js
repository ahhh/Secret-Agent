// POST /games/{slug}/agents/{handle}/complete
// Header: X-Handler-Key required
// Body: { stylish?: boolean }
// Promotes agent from secret-agent → special-agent and awards mission points.

const { readGameState, writeGameState, calcScore, ok, requireHandlerKey } = require('./gameState');

exports.handler = async (event) => {
  if (!requireHandlerKey(event)) return ok(401, { error: 'Unauthorized' });

  const { slug, handle } = event.pathParameters;
  const body = JSON.parse(event.body || '{}');

  const state = await readGameState(slug);
  const agent = state.agents[handle];

  if (!agent) return ok(404, { error: 'Agent not found' });
  if (agent.status === 'special-agent') return ok(409, { error: 'Mission already completed' });

  const now = new Date().toISOString();
  agent.scoreEvents.push({ reason: 'mission-complete', points: 3, at: now });
  if (body.stylish === true) {
    agent.scoreEvents.push({ reason: 'stylish-bonus', points: 1, at: now });
  }

  agent.status = 'special-agent';
  agent.completedAt = now;
  agent.score = calcScore(agent);

  await writeGameState(slug, state);

  return ok(200, {
    success: true,
    agent: { handle: agent.handle, status: agent.status, score: agent.score },
  });
};
