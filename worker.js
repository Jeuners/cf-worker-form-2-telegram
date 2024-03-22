addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Important! Store the token in a variable in the Cloudflare dashboard or configure it using Wrangler.
const TELEGRAM_BOT_TOKEN = '{YOUR BOT TOKEN}';

const CHAT_ID = '{YOUR CHAT ID}';
const BASE_URL = `https://api.telegram.org/${TELEGRAM_BOT_TOKEN}`;
const YOUR_DOMAIN = '{YOUR DOMAIN FOR REDIRECT}';

async function sendMessage(text) {
  const response = await fetch(`${BASE_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
    }),
  });

  return response.json();
}

async function handleRequest(request) {
  if (request.method === "POST") {
    // Attempt to read incoming data as form data
    const formData = await request.formData();
    const formEntries = Object.fromEntries(formData.entries());
    const messageText = Object.keys(formEntries).map(key => `${key}: ${formEntries[key]}`).join('\n');
    
    try {
      await sendMessage(`Form data received:\n\n${messageText}`);
      // Redirect on success
      return Response.redirect(`${YOUR_DOMAIN}/#thank-you`, 302);
    } catch (error) {
      console.error(error);
      // Redirect on failure
      return Response.redirect(`${YOUR_DOMAIN}/#message-fail`, 302);
    }
  }

  // For non-POST requests, redirect to the form or another page
  return Response.redirect(YOUR_DOMAIN, 302);
}
