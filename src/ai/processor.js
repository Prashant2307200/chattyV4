import { tools } from "./tools.js";
import client from "../config/ai.config.js";
import { getSystemPrompt } from "./system.js";

// tasks on automation
export async function processAIChat(userMessage, userId) {

  const SYSTEM_PROMPT = getSystemPrompt(userId); 

  userMessage = userMessage.trim().replace(/[<>]/g, '')
  const userQuery = { type: "user", user: userMessage };

  const messages = [{ role: "system", content: SYSTEM_PROMPT }]
  messages.push({ role: "user", content: JSON.stringify(userQuery) });

  while (1) {
    const chat = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: messages,
      response_format: { type: "json_object" }
    });

    const response = chat.choices[0].message.content;
    messages.push({ role: "assistant", content: response });

    const action = JSON.parse(response); 
    if (action.type === "output") return action.output;
    else if (action.type === "action") { 
      const fn = tools[action.function];
      if (!fn) return "Invalid tool called, Please perform allowed task";
      const observation = await fn(...action.input);
      const obs = { type: "observation", observation };
      messages.push({ role: "assistant", content: JSON.stringify(obs) });
    }
  }
}