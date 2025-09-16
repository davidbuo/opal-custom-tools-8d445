import { tool } from "@optimizely-opal/opal-tools-sdk";

async function hiConny() {
  return "Hi Conny";
}

tool({
  name: "hi-conny",
  description: "Returns a greeting message for Conny",
  parameters: [],
})(hiConny);