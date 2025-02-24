/*
  🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝
  🐝🐝 BZZ 🐝🐝🐝🐝 BZZZZZ 🐝🐝🐝🐝🐝🐝🐝🐝
  🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝

  When making a complicated bot, a big issue is that the AI starts to break down when given too many instructions.
  One way to get around this is the swarm pattern.

  https://cookbook.openai.com/examples/orchestrating_agents
  https://github.com/openai/swarm
*/

import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { Agent } from "../util/agent";
import { executeToolCall } from "../util/tools";
import { triageAgent } from "../util/agents";

async function runFullTurn(
  agent: Agent,
  messages: ChatCompletionMessageParam[],
) {
  let currentAgent = agent;

  while (true) {
    const result = await currentAgent.runChatCompletion(messages);
    messages.push(result);

    // No tools calls, we are done generating
    if (!result.tool_calls || !result.tool_calls.length) {
      return result.content;
    }

    await Promise.all(
      result.tool_calls!.map(async (toolCall) => {
        const toolResult = await executeToolCall(toolCall);

        if (toolResult.type === "agent") {
          currentAgent = toolResult.agent;
          messages.push({
            role: "tool",
            content: `Transfered to ${currentAgent.name}. Adopt persona immediately.`,
            tool_call_id: toolResult.toolCallId,
          });
        } else if (toolResult.type === "content") {
          messages.push({
            role: "tool",
            content: toolResult.content,
            tool_call_id: toolResult.toolCallId,
          });
        }
      }),
    );
  }
}

const messages: ChatCompletionMessageParam[] = [];

while (true) {
  const input = await new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
  messages.push({ role: "user", content: input as string });

  const res = await runFullTurn(triageAgent, messages);
  console.log(`assistant: ${res}`);
}
