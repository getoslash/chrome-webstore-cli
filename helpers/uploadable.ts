import { debugLog, path } from "../deps.ts";
import { zipDirectory } from "../utils/zip.ts";
import { default as temporaryDirectory } from "../utils/temp-directory.ts";

/**
 * Prepares a given path for upload.
 * If the given path is a file, it is returned as-is.
 * If it is a directory, a ZIP file is created out of it
 * and the file path of that ZIP file is returned.
 */
export const prepareFilesOrDirectoryForUpload = async (
  filePath: string,
): Promise<{
  filePath: string;
  cleanupRequired: boolean;
}> => {
  const debug = debugLog("cwc:helpers:uploadable");
  const file = await Deno.open(filePath, { read: true });
  const fileInfo = await Deno.fstat(file.rid);
  Deno.close(file.rid);
  debug("fetched input source info %j", fileInfo);
  if (fileInfo.isFile) {
    return {
      filePath,
      cleanupRequired: false,
    };
  } else if (fileInfo.isDirectory) {
    const zipFilePath = path.join(
      temporaryDirectory,
      `${path.basename(filePath)}.zip`,
    );
    debug("input source is a directory, so creating zip file %s", zipFilePath);
    await zipDirectory(filePath, zipFilePath);
    debug("zip file created %s", zipFilePath);
    return {
      filePath: zipFilePath,
      cleanupRequired: true,
    };
  } else {
    throw new Error(
      `Could not process path ${filePath} as it wasn't a file nor a directory!`,
    );
  }
};
