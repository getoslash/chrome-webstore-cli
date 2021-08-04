/**
 * Format and print error (so it looks good next to the usual help prompt).
 * Also exit with the specified error code.
 */
export const printErrorAndExit = (
  error: string,
  exitCode = 1,
): void => {
  console.error(`\nError:\n  ${error}`);
  Deno.exit(exitCode);
};
