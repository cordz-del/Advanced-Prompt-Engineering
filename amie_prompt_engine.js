// src/amie_prompt_engine.js
// Advanced Prompt Engineering Module for Amie

// Make sure to install OpenAI's node package (openai) and use a fetch API for Claude.
import fetch from 'node-fetch';
import openai from 'openai';

// Generate a prompt by injecting context into a base template.
export async function generateResponse(userContext, userInput) {
  // Build the base prompt with context injection and prompt chaining.
  const basePrompt = `You are Amie, a compassionate SEL assistant. 
A user has just mentioned: "${userInput}".
Their context is: ${JSON.stringify(userContext)}.
Provide supportive, empathetic, and actionable advice.`;

  // First, try GPT-4.
  try {
    const gpt4Response = await getGPT4Response(basePrompt);
    return gpt4Response;
  } catch (error) {
    console.error("GPT-4 error, switching to Anthropic Claude:", error);
    // Fallback to Anthropic Claude if GPT-4 fails.
    const claudeResponse = await getClaudeResponse(basePrompt);
    return claudeResponse;
  }
}

// Call OpenAI's GPT-4 API.
async function getGPT4Response(prompt) {
  const response = await openai.ChatCompletion.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are Amie, a compassionate SEL assistant." },
      { role: "user", content: prompt }
    ],
    max_tokens: 150,
    temperature: 0.7
  });
  return response.choices[0].message.content.trim();
}

// Call Anthropic Claude API using fetch.
async function getClaudeResponse(prompt) {
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }
  const url = "https://api.anthropic.com/v1/complete";
  const payload = {
    prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
    model: "claude-v1",
    max_tokens_to_sample: 150,
    temperature: 0.7,
    stop_sequences: ["\n\nHuman:"]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }
  const data = await response.json();
  return data.completion.trim();
}
