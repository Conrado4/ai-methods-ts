import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { Agent } from "./agent";
import type { Tool } from "./tools";

export const triageAgent = new Agent(
  "Triage Agent",
  `You are the triage agent in an IT help desk. Your job is to figure out what the user needs and refer to the relevant agent.`,
);

export const hardwareAgent = new Agent(
  "Hardware agent",
  `You are the hardware agent for an IT help desk.`,
);

export const transferBackToTriage: Tool = {
  definition: {
    type: "function",
    function: {
      name: "transfer_back_to_triage",
      description: "Call this to go back to the triaging assistant",
    },
  },
  execute: async (toolCall: ChatCompletionMessageToolCall) => {
    console.log("------- transfered back to triage agent");
    return {
      type: "agent",
      agent: triageAgent,
      toolCallId: toolCall.id,
    };
  },
};

export const transferToHardwareAgent: Tool = {
  definition: {
    type: "function",
    function: {
      name: "transfer_to_hardware_agent",
      description: "Call this whenever the user has a hardware problem",
    },
  },
  execute: async (toolCall: ChatCompletionMessageToolCall) => {
    console.log("-------  transfered to hardware agent");
    return {
      type: "agent",
      agent: hardwareAgent,
      toolCallId: toolCall.id,
    };
  },
};

triageAgent.tools = [transferToHardwareAgent.definition];
hardwareAgent.tools = [transferBackToTriage.definition];
