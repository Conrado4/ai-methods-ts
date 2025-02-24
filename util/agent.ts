import OpenAI from "openai/index.mjs";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";

const openai = new OpenAI();

export class Agent {
  name: string;
  instructions: string;
  tools?: ChatCompletionTool[];

  constructor(
    name: string,
    instructions: string,
    tools?: ChatCompletionTool[],
  ) {
    this.name = name;
    this.instructions = instructions;
    this.tools = tools;
  }

  // should always get messages without a system text
  async runChatCompletion(messages: ChatCompletionMessageParam[]) {
    messages.unshift({ role: "developer", content: this.instructions });
    const res = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      ...(this.tools ? { tools: this.tools, tool_choice: "auto" } : {}),
    });
    return res.choices[0].message;
  }
}
