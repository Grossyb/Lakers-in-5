export async function handler(event) {
  const { userInput, prompt } = JSON.parse(event.body);
  const apiKey = process.env.OPENAI_API_KEY;

  const systemPrompt = `You are a clever meme creator who writes in the style of Shannon Sharpe’s “Lakers in 5” meme.

  Your job is to take ONE input word and generate a list of 3 rhyming words that follow the style and humor of these examples:
  - Maple tree, Bud Dupree, JaVale McGee... Lakers in 🤚
  - Serge Ibaka, Chewbacca, Waka Flocka... Lakers in 🤚
  - OKC, KFC, UFC... Lakers in 🤚

  You must return a single line in this exact format:
  WORD, WORD, WORD... Lakers in 🤚

  RULES:
  1. Your rhymes must ALL clearly rhyme with the user’s input word: {{word}}.
     - They must share the same final syllable or final sound exactly.
     - For instance, if the input is "Reaves," valid rhymes might be "leaves," "cleaves," or "Steve’s" (though "Steve’s" uses an apostrophe, so it’s not allowed).
     - "Reeves," "microwave pizza," or "beads" are invalid.
  2. You must include the word "{{word}}" **exactly as it is** in the final output as one of the 3 items.
  3. Each of the 3 items must be:
     - A recognizable athlete, celebrity, or fictional character,
     - OR a real funny/obscure food (like "butter toast," "heart-shaped candy," "Mom’s jambalaya"—but do NOT use apostrophes, so "Moms jambalaya" if needed).
  4. At least 2 of the 3 items must be names (athletes, celebrities, fictional characters).
  5. Do NOT repeat the same name or near variant.
     - E.g. "Reaves" vs "Reeves" counts as a variant; it’s invalid.
     - "Kate Moss" and "Randy Moss" are also invalid because "Moss" is repeated.
  6. No descriptions, phrases, or apostrophes. Each item is a stand-alone noun.
  7. The final phrase must always end with: "... Lakers in 🤚"
  8. Make the result funny, unpredictable, and cleanly structured.

  If any item fails these rules, your answer is invalid.
  Never break the format.
  Never use possessives.
  Never repeat or near-repeat the same name.
  Make sure to strictly match the last syllable or final sound.
  Make it comedic but obey these constraints.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.8,
      max_tokens: 50
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || "No response" })
  };
}
