export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    if (!data.firstName || !data.lastName || !data.email || !data.attendance) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const airtableRes = await fetch(
      'https://api.airtable.com/v0/appIvQCZHBkJbOn0e/tbl5lGtohdFApVFeY',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'First Name': data.firstName,
            'Last Name': data.lastName,
            'Email': data.email,
            'Attendance': true,
            'Partner Name': data.partnerName || '',
            'Notes': data.notes || '',
          },
        }),
      }
    );

    if (!airtableRes.ok) {
      const errText = await airtableRes.text();
      return new Response(JSON.stringify({ error: 'Airtable error', detail: errText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
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
