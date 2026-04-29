// POST /games/{slug}/agents
// Body: { handle: string }
// Returns: { success, handle, mission: { id, category, difficulty, objective, coverStory, evidence, handlerContact } }
// The full mission text is never stored in the static site — it lives in S3 missions/{slug}.json
// and is returned once at registration time, then forgotten.

const { readGameState, writeGameState, readMissionPool, calcScore, ok } = require('./gameState');

exports.handler = async (event) => {
  const { slug } = event.pathParameters;
  const body = JSON.parse(event.body || '{}');
  const handle = (body.handle ?? '').trim();

  if (!handle) return ok(400, { error: 'handle is required' });
  if (handle.length > 24) return ok(400, { error: 'Handle must be 24 characters or less' });

  // Normalize handle to a stable key (case-insensitive, spaces → hyphens)
  const key = handle.toLowerCase().replace(/\s+/g, '-');

  const [state, missions] = await Promise.all([
    readGameState(slug),
    readMissionPool(slug),
  ]);

  if (state.agents[key]) return ok(409, { error: 'Handle already taken' });

  const assigned = new Set(Object.values(state.agents).map(a => a.missionId));
  const available = missions.filter(m => !assigned.has(m.id));

  if (!available.length) return ok(503, { error: 'No missions available — contact the Handler' });

  const mission = available[Math.floor(Math.random() * available.length)];

  state.agents[key] = {
    handle,
    key,
    status: 'secret-agent',
    missionId: mission.id,
    scoreEvents: [],
    registeredAt: new Date().toISOString(),
    completedAt: null,
  };

  await writeGameState(slug, state);

  return ok(201, {
    success: true,
    handle,
    mission: {
      id: mission.id,
      category: mission.category,
      difficulty: mission.difficulty,
      objective: mission.objective,
      coverStory: mission.coverStory,
      evidence: mission.evidence,
      handlerContact: mission.handlerContact ?? 'Contact the Handler directly to submit evidence.',
    },
  });
};
