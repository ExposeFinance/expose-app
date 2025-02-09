import { Nebula } from "thirdweb/ai";
import { Account } from "thirdweb/wallets";
import { client } from "./thirdwebClient.js";

type NebulaExecuteInput = Omit<Nebula.Input, "client"> & {
  client?: Nebula.Input["client"];
  account: Account;
};

export default async function nebulaExecute(input: NebulaExecuteInput) {
  try {
    const result = await Nebula.execute({
      ...input,
      client: input.client || client,
      account: input.account,
    } as Nebula.Input & { account: Account });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
