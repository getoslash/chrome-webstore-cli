import { cac, debugLog } from "./deps.ts";
import { printErrorAndExit } from "./helpers/console.ts";
import { isPublishError, publish, upload } from "./helpers/api.ts";

export const cli = cac("cwc");

cli.help();

cli.option(
  "--extension-id <id>",
  "ID of the extension on the Chrome Web Store",
);
cli.option("--client-id <client-id>", "Google API OAuth2 client ID");
cli.option(
  "--client-secret <client-secret>",
  "Google API OAuth2 client secret",
);
cli.option(
  "--refresh-token <refresh-token>",
  "Google API OAuth2 refresh token",
);

cli.command("upload", "Upload directory or ZIP file to Chrome Web Store")
  .option("--source <input>", "Path of directory or ZIP file to upload")
  .option("--auto-publish", "Automatically publish after upload")
  .action(async (entry) => {
    const debug = debugLog("cwc:upload");
    debug("parsed options %j", entry);

    const uploadResult = await upload({
      source: entry.source,
      extensionId: entry.extensionId,
      clientId: entry.clientId,
      clientSecret: entry.clientSecret,
      refreshToken: entry.refreshToken,
      autoPublish: entry.autoPublish || false,
    });
    debug("upload result %j", uploadResult);

    if (uploadResult.upload.uploadState === "SUCCESS") {
      console.log("Upload OK");
    } else {
      console.warn(`Upload ${uploadResult.upload.uploadState}`);
      if (uploadResult.upload.itemError?.[0]) {
        printErrorAndExit(
          `${uploadResult.upload.itemError[0].error_code} – ${
            uploadResult.upload.itemError[0].error_detail
          }`,
        );
      }
    }

    if (entry.autoPublish) {
      if (!isPublishError(uploadResult.publish)) {
        console.log(`Publish ${uploadResult.publish?.status}`);
      } else {
        printErrorAndExit(uploadResult.publish.error.message);
      }
    }
  });

cli.command("publish", "Publish last upload to Chrome Web Store")
  .option("--trusted-testers", "Publish only to trusted testers")
  .action(async (entry) => {
    const debug = debugLog("cwc:publish");
    debug("parsed options %j", entry);
    const publishResult = await publish({
      extensionId: entry.extensionId,
      clientId: entry.clientId,
      clientSecret: entry.clientSecret,
      refreshToken: entry.refreshToken,
      trustedTesters: entry.trustedTesters || false,
    });
    debug("publish result %j", publishResult);

    if (!isPublishError(publishResult)) {
      console.log(`Publish ${publishResult.status[0]}`);
    } else {
      printErrorAndExit(publishResult.error.message);
    }
  });

if (import.meta.main) {
  try {
    const parsed = cli.parse([
      Deno.execPath(),
      import.meta.url,
      ...Deno.args,
    ], { run: false });
    if (!cli.matchedCommandName && !parsed.options.help) {
      throw new Error("No valid command found");
    }
    cli.runMatchedCommand();
  } catch (error) {
    cli.outputHelp();
    printErrorAndExit(error.message, 1);
  }
}
