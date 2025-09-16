import { tool } from "@optimizely-opal/opal-tools-sdk";

async function hiConny() {
  const politeGreetings = [
    "Good day, Officer Conny! Hope you're doing well.",
    "Hello there, Conny! Thank you for your service.",
    "Greetings, Mr. Conny! It's an honor to assist you.",
    "Good morning/afternoon, Conny! How may I help you today?",
    "Hello, Officer Conny! I trust you're having a good day.",
    "Salutations, Conny! Your dedication to service is appreciated.",
    "Good to see you, Conny! Hope all is well with you.",
    "Hello, Conny! Thank you for your years of service to the community.",
    "Greetings, Officer Conny! How can I be of assistance?",
    "Good day, Conny! Your professionalism is always respected."
  ];

  const randomIndex = Math.floor(Math.random() * politeGreetings.length);
  return politeGreetings[randomIndex];
}

tool({
  name: "hi-conny",
  description: "Returns a random polite greeting message for Conny, acknowledging his service in the police force",
  parameters: [],
})(hiConny);