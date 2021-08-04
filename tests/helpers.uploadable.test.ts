import { isFile } from "./helpers/io.ts";
import { path } from "../deps.ts";
import { assertEquals } from "../dev_deps.ts";
import { prepareFilesOrDirectoryForUpload } from "../helpers/uploadable.ts";
import { default as temporaryDirectory } from "../utils/temp-directory.ts";

Deno.test({
  name:
    "prepareFilesOrDirectoryForUpload() > should return file name as-is if input is a file",
  fn: async () => {
    const output = await prepareFilesOrDirectoryForUpload(
      "./tests/fixtures/extension.zip",
    );
    const expected = {
      cleanupRequired: false,
      filePath: "./tests/fixtures/extension.zip",
    };
    assertEquals(output, expected);
  },
});

Deno.test({
  name:
    "prepareFilesOrDirectoryForUpload() > should create a ZIP file and return its path along with cleanup flag if input is a directory",
  fn: async () => {
    const output = await prepareFilesOrDirectoryForUpload(
      "./tests/fixtures/extension",
    );
    const expectedFilePath = path.join(temporaryDirectory, "extension.zip");
    const expected = {
      cleanupRequired: true,
      filePath: expectedFilePath,
    };
    assertEquals(output, expected);
    assertEquals(await isFile(expectedFilePath), true);
    await Deno.remove(expectedFilePath);
  },
});
