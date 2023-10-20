# NPC Companion Chat

An GPT-powered character generator based on Dungeons and Dragons. Create your character based on commonly chosen classes and races, along with detailed personality traits. Then start a conversation with them in any environment or place.


## What you will need:
1. Supabase account with a project (sign-up and registration are done this way)
2. OpenAI Account and API Key
3. Vercel or other hosting account to host this app
4. Upstash account to use Redis (for caching)

## How it works

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Edit the env.local with your own OpenAI key and Supabase URL and Key, and Upstash URL and Token.

You can set the type of OpenAI model in your ENV VARS, either gpt-3.5-turbo or gpt-4.

Refer to to the starter.sql to create the tables needed.

This project uses the [ChatGPT API](https://openai.com/api/) to understand questions that the users .

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm install
npm run dev
```

Bun also works.

```bash
bun install
bun run dev
```

