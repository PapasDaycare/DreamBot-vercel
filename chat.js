export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBLv1K51aj30_ofugQhsWE1LxB_MKy-Eys, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    const data = await geminiRes.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json({ reply: reply || "Sorry, I didn’t catch that. Try asking again!" });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ reply: "There was a problem getting a response." });
  }
}
