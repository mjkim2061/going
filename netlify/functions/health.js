export default async () => {
  return new Response(
    JSON.stringify({ ok: true, model: process.env.OPENAI_MODEL || 'gpt-5-mini' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}