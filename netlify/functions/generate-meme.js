export async function handler(event) {
  const { userInput, systemPrompt } = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.2,
      max_tokens: 100
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || "No response" })
  };
}
