export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.attendance) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store in D1 if available
    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT INTO rsvps (first_name, last_name, email, attendance, partner_name, notes, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        data.firstName,
        data.lastName,
        data.email,
        data.attendance,
        data.partnerName || '',
        data.notes || '',
        data.submittedAt || new Date().toISOString()
      ).run();
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
