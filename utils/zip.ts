import { JSZip, path } from "../deps.ts";

const IGNORED_FILES = [
  ".DS_Store",
  "Thumbs.db",
];

/**
 * Recursively read directory and file paths and return a list of all files.
 *
 * **Note**: Symlinks and specific junk files are ignored.
 */
export const getFilepaths = async (startingPath: string) => {
  let names: Array<string> = [];
  for await (const entry of Deno.readDir(startingPath)) {
    if (!IGNORED_FILES.includes(entry.name)) {
      if (!entry.isSymlink) {
        const entryPath = path.join(startingPath, entry.name);
        if (entry.isDirectory) {
          names = names.concat(await getFilepaths(entryPath));
        } else {
          names.push(entryPath);
        }
      }
    }
  }

  return names;
};

/**
 * Creates a ZIP file of the given directory.
 */
export const zipDirectory = async (
  directoryPath: string,
  outputFilePath: string,
) => {
  const zip = new JSZip();
  const originalWorkingDirectory = Deno.cwd();
  const absolutePath = path.resolve(directoryPath);
  Deno.chdir(absolutePath);
  const filePaths = await getFilepaths(absolutePath);
  const relativeFilePaths = filePaths.map((fp) =>
    path.relative(absolutePath, fp)
  );
  Deno.chdir(originalWorkingDirectory);
  for (const filePath of relativeFilePaths) {
    const contents = await Deno.readFile(
      path.resolve(path.join(absolutePath, filePath)),
    );
    zip.addFile(filePath, contents);
  }
  await zip.writeZip(outputFilePath);
  return;
};
