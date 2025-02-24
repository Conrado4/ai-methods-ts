/*
  Structured output is sort of like function calling,
  but typically used when it's not in the context of a chat.
  So if you want to use the ai on:
    - a button click
    - a background/scheduled task
    etc...
  Using structured output is typically pretty nice.
*/

import { runChatWithStructuredOutput } from "../util/runChat";

const result = await runChatWithStructuredOutput([
  {
    role: "developer",
    content:
      "Your job is to take a short sentence and write output an email. You must answer in JSON format {title: string, to: string, body: string}",
  },
  {
    role: "user",
    content:
      "Write an email to Villy Sleepvalley (villy@sleepvalley.dk) asking him if the ice is still melting at the pooooles",
  },
]);

console.log(result);

// Then you can parse into an object and work with it in code.
