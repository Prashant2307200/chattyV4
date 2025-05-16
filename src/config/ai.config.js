import OpenAI from "openai";

import { AppConfig } from "./app.config.js";

const API_KEY = AppConfig.env.GEMINI_API_KEY;

const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default client;