import { createHash, iterateReader } from "../../dev_deps.ts";
import type { SupportedAlgorithm } from "../../dev_deps.ts";

export const calculateFileHash = async (
  filePath: string,
  hashMethod: SupportedAlgorithm = "md5",
): Promise<string> => {
  const hash = createHash(hashMethod);
  const file = await Deno.open(filePath);
  for await (const chunk of iterateReader(file)) {
    hash.update(chunk);
  }
  Deno.close(file.rid);
  return hash.toString();
};

export const calculateFileSize = async (
  filePath: string,
): Promise<number> => {
  const file = await Deno.open(filePath, { read: true });
  const fileInfo = await Deno.fstat(file.rid);
  Deno.close(file.rid);
  return fileInfo.size;
};

export const isFile = async (
  filePath: string,
): Promise<boolean> => {
  const fileInfo = await Deno.stat(filePath);
  return fileInfo.isFile;
};
