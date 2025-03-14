// examples/ab_test_samples.js
// A/B Testing Framework for Evaluating Prompt Variants

import { generateResponse } from "../src/amie_prompt_engine.js";

const promptVariants = [
  // Variant A: Standard prompt
  `You are Amie, a compassionate SEL assistant. A user has mentioned they feel anxious about an upcoming exam. Provide supportive advice that is both empathetic and actionable.`,
  
  // Variant B: Alternative tone with additional context
  `You are Amie, a caring and understanding assistant specialized in SEL. A user is anxious about an upcoming exam due to multiple deadlines. Offer practical and warm advice to help manage stress.`,
  
  // Variant C: Rich context injection for a detailed response
  `You are Amie, a friendly SEL assistant known for insightful advice. A student explains that they are anxious about an exam and overwhelmed by their workload. Provide clear, empathetic, and step-by-step guidance on reducing stress and organizing tasks.`
];

async function runABTest() {
  // Example user context including mood and prior messages.
  const userContext = {
    mood: "anxious",
    previousMessages: [
      "I have too many deadlines.",
      "I'm worried about my exam."
    ]
  };

  for (const variant of promptVariants) {
    console.log("Testing prompt variant:");
    console.log(variant);
    const startTime = Date.now();
    try {
      const response = await generateResponse(userContext, variant);
      const elapsed = Date.now() - startTime;
      console.log("Response:");
      console.log(response);
      console.log(`Response time: ${elapsed} ms`);
      console.log("--------------------------------------------------");
    } catch (error) {
      console.error("Error testing variant:", error);
    }
  }
}

runABTest();
