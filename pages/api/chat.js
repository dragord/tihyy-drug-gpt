export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Ти лагідний емоційний підтримуючий помічник на ім’я Тихий Друг." },
        { role: "user", content: message }
      ],
    }),
  });

  const data = await response.json();

  if (data.choices?.length > 0) {
    res.status(200).json({ response: data.choices[0].message.content });
  } else {
    res.status(500).json({ error: "GPT не відповів. Спробуй ще раз." });
  }
}