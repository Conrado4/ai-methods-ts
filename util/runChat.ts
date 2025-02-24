import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";
import { openai } from "./init";

export async function runChat(messages: ChatCompletionMessageParam[]) {
  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4o",
  });

  return completion.choices[0].message.content;
}

export async function runChatWithTools(
  messages: ChatCompletionMessageParam[],
  tools: ChatCompletionTool[],
  handleToolcall: (name: string, args: any) => string,
) {
  while (true) {
    console.log(`---- Running chat with tools round -----`);

    const completion = await openai.chat.completions.create({
      tools,
      messages,
      model: "gpt-4o",
    });
    messages.push(completion.choices[0].message);

    // If no tools calls, we are done generating
    if (
      !completion.choices[0].message.tool_calls ||
      !completion.choices[0].message.tool_calls.length
    ) {
      return completion.choices[0].message.content;
    }

    // Otherwise handle the toolcalls
    await Promise.all(
      completion.choices[0].message.tool_calls.map(async (toolcall) => {
        console.log(
          `TOOLCALL: Running tool ${toolcall.function.name} with args ${toolcall.function.arguments}`,
        );
        messages.push({
          role: "tool",
          content: handleToolcall(
            toolcall.function.name,
            JSON.parse(toolcall.function.arguments),
          ),
          tool_call_id: toolcall.id,
        });
      }),
    );
  }
}
