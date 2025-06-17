const { generateTags } = require("./services/tagService");

// Test the tag generation function
async function testTagGeneration() {
  console.log("Testing tag generation...\n");

  const testCases = [
    {
      title: "Login page crashes on mobile devices",
      description:
        "When users try to login on mobile devices, the login page crashes immediately after entering credentials. This happens on both iOS and Android browsers.",
    },
    {
      title: "Database connection timeout",
      description:
        "The application frequently experiences database connection timeouts during peak hours, causing users to lose their work and data.",
    },
    {
      title: "API endpoint returns 500 error",
      description:
        "The /api/users endpoint is returning 500 internal server errors when trying to fetch user data. This affects the user management dashboard.",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test Case ${i + 1}:`);
    console.log(`Title: ${testCase.title}`);
    console.log(`Description: ${testCase.description}`);

    try {
      const tags = await generateTags(testCase.title, testCase.description);
      console.log(`Generated Tags: ${tags.join(", ")}`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      console.log("Using fallback tags: bug, issue");
    }

    console.log("---\n");
  }
}

// Run the test
testTagGeneration().catch(console.error);
