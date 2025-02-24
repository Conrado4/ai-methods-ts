/*
  Simple classifier using structured output
*/

import { runChatWithStructuredOutput } from "../util/runChat";

const emails = [
  {
    title: "Password Reset Request - Urgent",
    body: "Hi IT Support, I've been locked out of my account after too many failed login attempts. I need an urgent password reset to access my work email and files. My employee ID is EMP2023-456. Thanks, Sarah from Accounting",
  },
  {
    title: "Printer Not Connecting to Network",
    body: "Hello Helpdesk, The printer on the 3rd floor (HP LaserJet 4200, ID: PRN-3F-01) isn't connecting to the network. I've tried turning it off and on, but it's still showing as offline. Multiple team members are unable to print. Please help! Best regards, Mike from Marketing",
  },
  {
    title: "New Software Installation Request",
    body: "Dear IT Team, I need Adobe Creative Suite installed on my workstation (Computer ID: WS-567) for an upcoming project. Please let me know when someone can help with the installation. Thank you, David from Design",
  },
  {
    title: "VPN Connection Issues",
    body: "Hi Support, I'm working remotely and can't connect to the VPN. I keep getting an 'Authentication Failed' error message. I've already tried clearing my cache and restarting my laptop. Username: jsmith. Urgently need this resolved. Thanks, John Smith",
  },
  {
    title: "Outlook Calendar Syncing Problem",
    body: "Hello IT, My Outlook calendar isn't syncing properly with my mobile device. Meeting invites aren't showing up on my phone, and I've missed several important meetings. I've already checked my sync settings. Can someone please help? Thanks, Rachel from HR",
  },
];

for (const email of emails) {
  const result = await runChatWithStructuredOutput([
    {
      role: "developer",
      content: `Your job is so categorize emails received by an IT help desk. You must answer in JSON format {category: "hardware" | "accountAndLogin" | "otherSoftware"}`,
    },
    {
      role: "developer",
      content: JSON.stringify(email),
    },
  ]);

  console.log(
    `email with title ${email.title} goes in category: ${JSON.parse(result ?? "").category}`,
  );
}
