import { path } from "../../dev_deps.ts";

export const normaliseFilePath = (filePath: string): string => {
  return path.toFileUrl(path.resolve(filePath)).href;
};
