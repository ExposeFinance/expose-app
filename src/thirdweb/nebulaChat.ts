import { Nebula } from "thirdweb/ai";
import { client } from "./thirdwebClient.js";

type NebulaChatInput = {
  client?: Nebula.Input["client"];
  message: string;
  contextFilter?: Nebula.Input["contextFilter"];
  sessionId?: string;
};

export default async function nebulaChat(input: NebulaChatInput) {
  try {
    const payload = {
      client: input.client || client,
      message: input.message,
      account: input.contextFilter?.walletAddresses,
      // Conditionally add contextFilter if provided
      ...(input.contextFilter ? { contextFilter: input.contextFilter } : {}),
      ...(input.sessionId ? { session_id: input.sessionId } : {}),
    } as Nebula.Input; // cast to Nebula.Input so TypeScript sees all required fields

    const response = await Nebula.chat(payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
