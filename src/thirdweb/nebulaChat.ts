import { Nebula } from "thirdweb/ai";
import { client } from "./thirdwebClient.js";
import { account } from "@/lib/utils";

type NebulaChatInput = {
  client?: Nebula.Input["client"];
  message: string;
  contextFilter?: Nebula.Input["contextFilter"];
  sessionId?: string;
};

export default async function nebulaChat(input: NebulaChatInput) {
  console.log("nebulaChat input", input);
  try {
    const payload = {
      client: input.client || client,
      message: input.message,
      account: input.contextFilter?.walletAddresses || account,
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
