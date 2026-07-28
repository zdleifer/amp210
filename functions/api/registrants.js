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
      name: `${(r.fields['First Name'] || '').charAt(0).toUpperCase()}. ${r.fields['Last Name'] || ''}`.trim(),
      comment: r.fields['Comment'] || '',
    }));
    return new Response(JSON.stringify({ count: registrants.length, registrants }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
