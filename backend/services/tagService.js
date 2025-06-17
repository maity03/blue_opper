const axios = require("axios");
require('dotenv').config();

const generateTags = async (title, description) => {
  try {
    const prompt = `Analyze the following bug report and generate 3-5 relevant tags that would help categorize and search for this bug. The tags should be concise, descriptive, and relevant to the technical nature of the issue.

Bug Title: ${title}
Bug Description: ${description}

Generate tags that could include:
- Technology/component affected (e.g., "frontend", "database", "API", "UI", "authentication")
- Type of issue (e.g., "crash", "performance", "security", "usability", "data-loss")
- Specific features or areas (e.g., "login", "search", "payment", "reporting")

Return only the tags as a comma-separated list, without any additional text or formatting.`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates relevant tags for bug reports. Return only comma-separated tags without any additional text.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
        },
      }
    );

    const tagsText = response.data.choices[0].message.content.trim();
    console.log(tagsText);

    // Parse the comma-separated tags and clean them up
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => tag.replace(/^["']|["']$/g, "")) // Remove quotes if present
      .slice(0, 5); // Limit to 5 tags maximum

    return tags;
  } catch (error) {
    console.error("Error generating tags:", error.message);
    // Return default tags if API fails
    return ["bug", "issue"];
  }
};

module.exports = {
  generateTags,
};
