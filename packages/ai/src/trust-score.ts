import Anthropic from "@anthropic-ai/sdk";
import type { TrustScore } from "@pruddo/shared";
import { getTrustVerdict } from "@pruddo/shared";

const client = new Anthropic();

export async function analyzeTrustScore(
  productName: string,
  reviews: string[]
): Promise<Pick<TrustScore, "score" | "verdict" | "pros" | "cons" | "fakeReviewPercent">> {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze the following reviews for "${productName}" and return a JSON object with:
- score (0-100 trust score)
- pros (array of strings, top 3)
- cons (array of strings, top 3)
- fakeReviewPercent (0-100)

Reviews:
${reviews.slice(0, 20).join("\n")}

Respond with only valid JSON.`,
      },
    ],
  });

  const content = message.content[0];
  if (content?.type !== "text") {
    throw new Error("Unexpected response from Claude");
  }

  const result = JSON.parse(content.text) as {
    score: number;
    pros: string[];
    cons: string[];
    fakeReviewPercent: number;
  };

  return {
    score: result.score,
    verdict: getTrustVerdict(result.score),
    pros: result.pros,
    cons: result.cons,
    fakeReviewPercent: result.fakeReviewPercent,
  };
}
