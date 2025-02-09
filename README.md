# Expose App

<img width="100%" alt="Screenshot 2025-02-09 at 6 16 55 pm" src="https://github.com/user-attachments/assets/9f40bad3-a8e9-4305-a336-a4835e173e35" />

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
- **Thirdweb** – SDK For Nebula and Wallets.
- **ElevenLabs** - Text to voice functionality.
- **OpenAI Whisper** -- Voice to text functionality.

---

## Todo List

- [x] Init repo for CLI
- [x] Set up Blockchain LLM - (MoM model using OpenAI, Claude & Deepseek - Trained on blockchain data and connected to Thirdweb for realtime data and transactions capabilities)
- [x] CLI based interface, chat with your agent, make onchain transactions and query live data - helpful tool for researchers and developers too!
- [x] Init repo for smart contracts (these are simplified ‘Router’ contracts for our LLM to work with, our LLM is specifically aware of these contracts in detail, allowing us to delivery consistent UX)
- [x] Execute arbitrary transactions unchain using natural language (Swaps, Sending crypto, Increment a counter.. so on.)
- [x] Init repo for APP
- [x] Basic app layout (built with VERT stack - vite, react, tailwind)
- [x] Basic chat interface
- [x] Branding colours for app
- [x] Voice mode - Chat to your agent using voice! (Leveraging OpenAI Whisper)
- [x] Add first load tour https://www.cult-ui.com/docs/components/intro-disclosure
- [x] Text to voice, so it reads out responses
- [x] User can create wallet by sign up via google
- [x] Bug: When user moves wallet page, it deletes the chat context - Make global chat context.
- [x] Customise agent voice, picture & name - Store via localstorage
- [x] Customise user profile
- [ ] Customise add a pre-prompt config to customise that agents context (e.g preferred contracts, networks, addresses)
- [ ] Create basic express backend to store user data
- [ ] Notify you intelligently, i.e new coin you might like
- [ ] Notify you for changes in your balances (without having to specify what tokens you own)
- [ ] Have multiple agents, each with their own pre-prompts and context and chat history (basically a distinct sessionID with a particular agent)
- [ ] Multiple chats with a single agent, not just one sessionID per agent
- [ ] Settings to turn on and off text to voice, add your wallet addresses, contract addresses etc to GLOBAL context
- [ ] Global and local context, for all agent context, and for one agent context
