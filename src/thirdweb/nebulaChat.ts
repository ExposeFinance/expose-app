import { Nebula } from "thirdweb/ai";
import { client } from "./thirdwebClient.js";

type NebulaChatInput = Omit<Nebula.Input, "client"> & {
  client?: Nebula.Input["client"];
};

export default async function nebulaChat(input: NebulaChatInput) {
  try {
    const response = await Nebula.chat({
      ...input,
      client: input.client || client,
      account: input.account,
    } as Nebula.Input);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
