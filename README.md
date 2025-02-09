# Expose App

<img width="100%" alt="Screenshot 2025-02-04 at 12 30 34 pm" src="https://github.com/user-attachments/assets/feecb9f2-c0e5-4cc3-9efa-992d62a5e21b" />

Welcome to the **Expose App**!

Swap, send, borrow and lend crypto with just your voice!

Never click a button again.. Say goodbye to Dapps 👋.

---

## 🚀 **Tech Stack**

The app is built with the following technologies:

- **React** – Component-based UI framework.
- **Vite** – Fast and lightweight development server and bundler.
- **TypeScript** – Ensures type safety and better developer experience.
- **React Router** – Handles client-side routing for seamless navigation.
- **Tailwind CSS** – Utility-first CSS framework for modern styling.
- **Shadcn UI** – Pre-configured, customizable components for React.
- **Lucide Icons** – Beautiful open-source icons.
- **Thirdweb** – SDK for building onchain apps.

---

## Todo List

- DONE: Init repo for CLI
- DONE: Set up Blockchain LLM - (MoM model using OpenAI, Claude & Deepseek - Trained on blockchain data and connected to Thirdweb for realtime data and transactions capabilities)
- DONE: CLI based interface, chat with your agent, make onchain transactions and query live data - helpful tool for researchers and developers too!
- DONE: Init repo for smart contracts (these are simplified ‘Router’ contracts for our LLM to work with, our LLM is specifically aware of these contracts in detail, allowing us to delivery consistent UX)
- DONe: Execute arbitrary transactions unchain using natural language (Swaps, Sending crypto, Increment a counter.. so on.)
- DONE: Init repo for APP
- DONE: Basic app layout (built with VERT stack - vite, react, tailwind)
- DONE: Basic chat interface
- DONE: Branding colours for app
- DONE: Voice mode - Chat to your agent using voice! (Leveraging OpenAI Whisper)
- DONE: Add first load tour https://www.cult-ui.com/docs/components/intro-disclosure
- DONE: Text to voice, so it reads out responses
- DONE: User can create wallet by sign up via google


- When I move to wallet page, it deletes the chat context - Make global chat context.
- Customise agent voice, picture & name - Store via localstorage
- Customise add a pre-prompt config to customise that agents context (e.g preferred contracts, networks, addresses)
- ChatGPT like interface with voice mode and large input prompt
- Create basic express backend to store use data
- Notify you intelligently, i.e new coin you might like
- Notify you for changes in your balances (without having to specify what tokens you own)
- Have multiple agents, each with their own pre-prompts and context and chat history (basically a distinct sessionID with a particular agent)
- Multiple chats with a single agent, not just one sessionID per agent
- Settings to turn on and off text to voice, add your wallet addresses, contract addresses etc to GLOBAL context
- Global and local context, for all agent context, and for one agent context
