export async function onRequestGet(context) {
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/appIvQCZHBkJbOn0e/tbl5lGtohdFApVFeY`,
      { headers: { 'Authorization': `Bearer ${context.env.AIRTABLE_TOKEN}` } }
    );
    const body = await res.text();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Airtable error', detail: body }), {
        status: 422, headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = JSON.parse(body);
    const registrants = (data.records || []).map(r => ({
      name: `${r.fields['First Name'] || ''} ${((r.fields['Last Name'] || '').charAt(0).toUpperCase() + '.').trim()}`.trim(),
      comment: r.fields['Comment'] || '',
      withGuest: (r.fields['Attending'] || '').includes('Guest'),
    }));
    const totalAttendees = registrants.reduce((sum, r) => sum + 1 + (r.withGuest ? 1 : 0), 0);
    return new Response(JSON.stringify({ count: totalAttendees, registrants }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
