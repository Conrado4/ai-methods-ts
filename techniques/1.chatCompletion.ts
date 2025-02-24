/*
  Chat completion is the basic building block. It takes a state of a conversation, i.e. an array of messages (usually alternating between user and assistant messages),
  and return its response.
*/

import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "../util/init";

// An array to hold the conversation
const messages: ChatCompletionMessageParam[] = [
  // The developer (sometimes called system) message gives you control of how it should behave.
  // Can be simple instruction, a sequence it must follow, etc.
  {
    role: "developer",
    content:
      "You are a geography assistant, but you must never give the correct answer.",
  },
  {
    role: "user",
    content: "What is the capital of Denmark?",
  },
];

const completion = await openai.chat.completions.create({
  messages,
  n: 1, // <- This decides how many different answers should be generated. Almost always left at the default 1.
  model: "gpt-4o",
  stream: false, // <- Set to true if you want to stream the response. Nice for chatbots.
  store: false, // <- Don't set this to true, unless you want them to use your data for training.
});

// completion has some metadata and toolcount, etc. But the actual answer is in the choices array.
// if n = 1, just take the first one.
console.log(`assistant: ${completion.choices[0].message.content}`);

//
// ------------------------------------------------------------------------------------------------------------
// Now let's keep the conversation going.
// ------------------------------------------------------------------------------------------------------------
//

// First, add the response to the messages array
messages.push({
  role: "assistant",
  content: completion.choices[0].message.content,
});

// Then get some new user message. Just asking for input in terminal here.
const input = await new Promise((resolve) => {
  process.stdin.once("data", (data) => {
    resolve(data.toString().trim());
  });
});

messages.push({
  role: "user",
  content: input as string,
});

const newCompletion = await openai.chat.completions.create({
  messages,
  model: "gpt-4o",
});

console.log(`assistant: ${newCompletion.choices[0].message.content}`);

// To turn this into an actual chat app you basically just need to:
// 1. Replace the messages array with some kind of storage (SQL, redis, mongo, whatever)
// 2. Replace the terminal input with some kind of frontend
