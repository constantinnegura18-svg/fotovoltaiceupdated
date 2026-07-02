/**
 * Cloudflare Pages Function: /api/lead
 * Primeste lead-ul de la pagina, valideaza, si il trimite la
 * Apps Script Web App care scrie in Google Sheets.
 */

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    // validare minima: telefon obligatoriu
    const phone = (data.phone || '').toString();
    if (phone.replace(/\D/g, '').length < 8) {
      return Response.json({ ok: false, error: 'telefon invalid' }, { status: 400 });
    }

    const res = await fetch(env.SHEETS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.SHEETS_SECRET, data }),
    });

    if (!res.ok) {
      return Response.json({ ok: false, error: 'sheets write failed' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
