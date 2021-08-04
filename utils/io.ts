import { readableStreamFromReader } from "../deps.ts";

/**
 * Returns `ReadbleStream` of `Uint8Array` from given file.
 */
export const getStream = async (
  filePath: string,
): Promise<ReadableStream<Uint8Array>> => {
  const fileReader = await Deno.open(filePath, { read: true, write: false });
  return readableStreamFromReader(fileReader);
};
