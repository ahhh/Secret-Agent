const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({});
const BUCKET = process.env.BUCKET_NAME;

async function readGameState(slug) {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: `games/${slug}.json` }));
    return JSON.parse(await res.Body.transformToString());
  } catch (err) {
    if (err.name === 'NoSuchKey') return { slug, agents: {} };
    throw err;
  }
}

async function writeGameState(slug, state) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: `games/${slug}.json`,
    Body: JSON.stringify(state, null, 2),
    ContentType: 'application/json',
  }));
}

// Missions are uploaded separately by the Handler to missions/{slug}.json
// and never served to the public site — objectives stay secret.
async function readMissionPool(slug) {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: `missions/${slug}.json` }));
    return JSON.parse(await res.Body.transformToString());
  } catch (err) {
    if (err.name === 'NoSuchKey') return [];
    throw err;
  }
}

function calcScore(agent) {
  return (agent.scoreEvents ?? []).reduce((sum, e) => sum + e.points, 0);
}

function ok(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Handler-Key',
    },
    body: JSON.stringify(body),
  };
}

function requireHandlerKey(event) {
  const key = event.headers?.['x-handler-key'] ?? event.headers?.['X-Handler-Key'] ?? '';
  return key === process.env.HANDLER_API_KEY;
}

module.exports = { readGameState, writeGameState, readMissionPool, calcScore, ok, requireHandlerKey };
