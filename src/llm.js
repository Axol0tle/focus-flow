import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Sends a list of tasks to the Gemini LLM and asks it to return a sorted list of task IDs.
 * @param {Array<Object>} tasks - The array of task objects.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of sorted task IDs.
 */
export async function getSmartSortedOrder(tasks) {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set in your .env file.");
  }
  try {
    // Use the 'gemini-1.5-flash-latest' model, which is fast and available on the free tier.
    const model = genAI.getGenerativeModel({ model: "models/gemini-3.6-flash" });

    // Create a clean, JSON-serializable representation of the tasks
    const taskDataForLLM = tasks.map(task => ({
      id: task.id,
      text: task.text,
      description: task.description,
      dueDate: task.dueDate,
      estimatedTime: task.estimatedTime,
      completed: task.completed
    }));

    const prompt = `
      You are a smart to-do list assistant. Your job is to reorder a list of tasks based on priority.
      A task that is already completed should be at the bottom of the list.
      For the incomplete tasks, consider the due date (sooner is more important), estimated time to complete, and the text of the task itself to determine urgency and importance.
      Here is the list of tasks as a JSON object:
      ${JSON.stringify(taskDataForLLM)}

      Please return ONLY a valid JSON array of the task IDs in the new, optimized order. Do not include any other text, explanation, or markdown formatting.
      The format must be: ["id1", "id2", "id3", ...]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const llmResponseText = response.text();

    // Clean up the response to ensure it's valid JSON before parsing
    const cleanedJsonString = llmResponseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Error calling Google AI:", error);
    throw new Error("Failed to get smart sort order from Google AI. Check the console for details.");
  }
}