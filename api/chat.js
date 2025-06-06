// api/chat.js - Vercel serverless function
export default async function handler(req, res) {
// Enable CORS
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

// Handle preflight requests
if (req.method === ‘OPTIONS’) {
res.status(200).end();
return;
}

if (req.method !== ‘POST’) {
return res.status(405).json({ error: ‘Method not allowed’ });
}

try {
const { message } = req.body;

```
if (!message) {
  return res.status(400).json({ error: 'Message is required' });
}

// Get API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  return res.status(500).json({ error: 'API key not configured' });
}

// Call Gemini API
const response = await callGeminiAPI(message, GEMINI_API_KEY);

res.json({ reply: response });
```

} catch (error) {
console.error(‘Error:’, error);
res.status(500).json({ error: ‘Internal server error’, details: error.message });
}
}

// Function to call Gemini API
async function callGeminiAPI(message, apiKey) {
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

const requestBody = {
contents: [{
parts: [{
text: message
}]
}]
};

try {
const response = await fetch(url, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
},
body: JSON.stringify(requestBody)
});

```
if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`Gemini API error (${response.status}): ${errorText}`);
}

const data = await response.json();

// Extract the response text
if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
  return data.candidates[0].content.parts[0].text;
} else {
  console.error('Unexpected Gemini response format:', JSON.stringify(data, null, 2));
  throw new Error('Unexpected response format from Gemini API');
}
```

} catch (error) {
console.error(‘Gemini API Error:’, error);
throw error;
}
}
