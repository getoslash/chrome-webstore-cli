import { calculateFileSize } from "./helpers/io.ts";
import { path } from "../deps.ts";
import { assertEquals } from "../dev_deps.ts";
import { getFilepaths, zipDirectory } from "../utils/zip.ts";
import { default as temporaryDirectory } from "../utils/temp-directory.ts";

Deno.test({
  name:
    "getFilePaths() > should return relative file paths when given a relative path and ignore symlinks and junk files",
  fn: async () => {
    const output = await getFilepaths("./tests/fixtures/extension");
    const expected = [
      "tests/fixtures/extension/background.js",
      "tests/fixtures/extension/hello.html",
      "tests/fixtures/extension/manifest.json",
      "tests/fixtures/extension/assets/dummy.txt",
    ];
    assertEquals(output.sort(), expected.sort());
  },
});

Deno.test({
  name:
    "getFilePaths() > should return absolute file paths when given an absolute path",
  fn: async () => {
    const output = await getFilepaths(
      path.resolve("./tests/fixtures/extension"),
    );
    const expected = [
      "tests/fixtures/extension/background.js",
      "tests/fixtures/extension/hello.html",
      "tests/fixtures/extension/manifest.json",
      "tests/fixtures/extension/assets/dummy.txt",
    ].map((p) => path.join(`${Deno.cwd()}`, p));
    assertEquals(output.sort(), expected.sort());
  },
});

Deno.test({
  name: "zipDirectory() > should ZIP a relative directory path correctly",
  fn: async () => {
    const outputPath = path.join(temporaryDirectory, "extension.zip");
    await zipDirectory("./tests/fixtures/extension", outputPath);
    const expectedSize = await calculateFileSize(
      "./tests/fixtures/extension.zip",
    );
    const outputSize = await calculateFileSize(outputPath);
    await Deno.remove(outputPath);
    // TODO: @paambaati Find a better way to determine ZIP integrity.
    // Checksums won't work right now as the ZIP includes timestamp metadata, so checksums are different every time.
    // TODO: @paambaati Try to fix the ZIP file size test for Windows.
    if (Deno.build.os !== "windows") assertEquals(outputSize, expectedSize);
  },
});
