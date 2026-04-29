// Handler-only operations. All require X-Handler-Key header.
//
// POST /games/{slug}/agents/{handle}/expose
//   Body: { exposerHandle?: string }
//   Marks agent as burned (-3). Awards exposer +2 if exposerHandle provided.
//
// PUT /games/{slug}/agents/{handle}/score
//   Body: { points: number, reason?: string }
//   Manual score adjustment (survival bonus, failed exposure penalty, etc.)
//
// POST /games/{slug}/agents/{handle}/survival
//   Awards end-of-game survival bonus (+2).

const { readGameState, writeGameState, calcScore, ok, requireHandlerKey } = require('./gameState');

exports.handler = async (event) => {
  if (!requireHandlerKey(event)) return ok(401, { error: 'Unauthorized' });

  const { slug, handle } = event.pathParameters;
  const method = (event.requestContext?.http?.method ?? event.httpMethod ?? '').toUpperCase();
  const rawPath = event.rawPath ?? event.path ?? '';
  const body = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  const state = await readGameState(slug);
  const agent = state.agents[handle];
  if (!agent) return ok(404, { error: 'Agent not found' });

  // ── Expose ────────────────────────────────────────────────────────────────
  if (rawPath.endsWith('/expose')) {
    if (agent.status === 'burned') return ok(409, { error: 'Agent already burned' });

    agent.status = 'burned';
    agent.scoreEvents.push({ reason: 'exposed', points: -3, at: now });
    agent.score = calcScore(agent);

    if (body.exposerHandle) {
      const exposer = state.agents[body.exposerHandle];
      if (exposer) {
        exposer.scoreEvents.push({ reason: 'successful-exposure', points: 2, at: now, target: handle });
        exposer.score = calcScore(exposer);
      }
    }

    await writeGameState(slug, state);
    return ok(200, { success: true, handle: agent.handle, status: 'burned', score: agent.score });
  }

  // ── Survival bonus ────────────────────────────────────────────────────────
  if (rawPath.endsWith('/survival')) {
    agent.scoreEvents.push({ reason: 'survival-bonus', points: 2, at: now });
    agent.score = calcScore(agent);
    await writeGameState(slug, state);
    return ok(200, { success: true, handle: agent.handle, score: agent.score });
  }

  // ── Manual score adjustment (PUT) ─────────────────────────────────────────
  if (method === 'PUT') {
    const { points, reason = 'manual-adjustment' } = body;
    if (typeof points !== 'number') return ok(400, { error: 'points must be a number' });

    agent.scoreEvents.push({ reason, points, at: now });
    agent.score = calcScore(agent);

    await writeGameState(slug, state);
    return ok(200, {
      success: true,
      handle: agent.handle,
      score: agent.score,
      events: agent.scoreEvents,
    });
  }

  return ok(400, { error: 'Unknown action' });
};
