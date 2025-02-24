/*
  Chat completions aren't that useful alone. Function (tool) calling can make it more powerful.
  You typically want to use function calling when:
    a) You want the ai to be up to date (current weather, news, prices, etc.)
*/

import type { ChatCompletionTool } from "openai/resources/index.mjs";

const toolDefinition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "start_health_check",
    description: "Send the user an adaptive card (interactive UI element) that allows them to start a health check for the given health area.",
    parameters: {
      type: "object",
      properties: {
        healthArea: {
          type: "string",
          enum: [
            "stress",
            "anxiety",
            "computer_vision_syndrome",
            "headaches",
            "sleeping_issues",
          ],
          description: "The health area to get a health plan for.",
        },
      },
      required: ["healthArea"],
    };
  };
};
