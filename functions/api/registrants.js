export async function onRequestGet(context) {
  try {
    const url = `https://api.airtable.com/v0/appIvQCZHBkJbOn0e/tbl5lGtohdFApVFeY?fields%5B%5D=First+Name&fields%5B%5D=Last+Name&fields%5B%5D=Comment`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${context.env.AIRTABLE_TOKEN}` },
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Airtable error' }), {
        status: 502, headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    const registrants = (data.records || []).map(r => ({
      name: `${(r.fields['First Name'] || '').charAt(0).toUpperCase()}. ${r.fields['Last Name'] || ''}`.trim(),
      comment: r.fields['Comment'] || '',
    }));
    return new Response(JSON.stringify({ count: registrants.length, registrants }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
