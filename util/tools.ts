import type {
  ChatCompletionMessageToolCall,
  ChatCompletionTool,
} from "openai/resources/index.mjs";
import type { Agent } from "./agent";
import { transferBackToTriage, transferToHardwareAgent } from "./agents";

export interface AgentToolResponse {
  type: "agent";
  toolCallId: string;
  agent: Agent;
}

export interface ContentToolResponse {
  type: "content";
  toolCallId: string;
  content: string;
}

export type Tool = {
  definition: ChatCompletionTool;
  execute: (
    toolCall: ChatCompletionMessageToolCall,
  ) => Promise<AgentToolResponse | ContentToolResponse>;
};

export async function executeToolCall(
  toolCall: ChatCompletionMessageToolCall,
): Promise<AgentToolResponse | ContentToolResponse> {
  switch (toolCall.function.name) {
    case transferToHardwareAgent.definition.function.name:
      return transferToHardwareAgent.execute(toolCall);

    case transferBackToTriage.definition.function.name:
      return transferBackToTriage.execute(toolCall);

    default:
      throw new Error("Tool not implemented");
  }
}
