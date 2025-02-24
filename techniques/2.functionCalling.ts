/*
  Chat completions aren't that useful alone (unless you want to make a gpt-clone).
  Function (tool) calling can make it more powerful.
  You typically want to use function calling when:
    - You want the ai to be up to date (current weather, news, prices, etc.)
    - You want the ai to use some of your data
    - You want the ai to be able to take actions on behalf of the user
*/

import type { ChatCompletionTool } from "openai/resources/index.mjs";
import { runChatWithTools } from "../util/runChat";

// Tools can be used for fetching data
const get_current_weather_definition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_current_weather",
    description:
      "Fetches the current weather information for the given location.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          enum: ["Copenhagen", "St. Anton"],
          description: "The city to fetch weather info for.",
        },
      },
      required: ["city"],
    },
  },
};

const result = await runChatWithTools(
  [
    {
      role: "user",
      content: "Is the weather better in copenhagen or St. Anton right now",
    },
  ],
  [get_current_weather_definition],
  (name, args) => {
    if (name === get_current_weather_definition.function.name) {
      // This is where you would actually implement the function
      switch (args.city as string) {
        case "Copenhagen":
          return "Cold and windy as hell";
        case "St. Anton":
          return "-5 degrees and clear skies. Perfect weather for a ski trip";
        default:
          throw new Error("Invalid args");
      }
    }
    throw new Error("Invalid function call");
  },
);
console.log(`Result with tool calls: ${result}`);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

console.log("Press any key to continue");
await new Promise((resolve) => {
  process.stdin.once("data", (data) => {
    resolve(data.toString().trim());
  });
});
console.log(`



`);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const book_ski_trip_definition: ChatCompletionTool = {
  type: "function",
  function: {
    name: "book_ski_trip",
    description: "Books a ski trip for the user in the given city.",
    parameters: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "The city to fetch weather info for.",
        },
      },
      required: ["city"],
    },
  },
};

const anotherResult = await runChatWithTools(
  [
    {
      role: "user",
      content: "If the weather is nice in St. Anton, book me a ski trip there",
    },
  ],
  [get_current_weather_definition, book_ski_trip_definition],
  (name, args) => {
    switch (name) {
      case get_current_weather_definition.function.name:
        // This is where you would actually implement the function
        switch (args.city as string) {
          case "Copenhagen":
            return "Cold and windy as hell";
          case "St. Anton":
            return "-5 degrees and clear skies. Perfect weather for a ski trip";
          default:
            throw new Error("Invalid args");
        }
      case book_ski_trip_definition.function.name:
        // This is where you would actually implement the function
        return `Ski trip for ${args.city}`;
      default:
        throw new Error("Invalid function call");
    }
  },
);

console.log(anotherResult);
