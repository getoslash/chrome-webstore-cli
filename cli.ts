import { Command, debugLog } from "./deps.ts";
import { version } from "./version.ts";
import { printErrorAndExit } from "./helpers/console.ts";
import { isPublishError, publish, upload } from "./helpers/api.ts";

const cli = new Command()
  .name("cwc")
  .version(version)
  .allowEmpty(false)
  .throwErrors()
  .description("Upload & publish extensions and themes to the Chrome Web Store")
  .example(
    "Upload and auto-publish your extension",
    'cwc upload --file "<path-to-file-or-folder>" --id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>" --auto-publish',
  )
  .example(
    "Publish the last uploaded version of your extension",
    'cwc publish --id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>"',
  )
  .example(
    "Publish the last uploaded version of your extension but only to trusted testers",
    'cwc publish --id "<extension-id>" --client-id "<client-id>" --client-secret "<client-secret>" --refresh-token "<refresh-token>" --trusted-testers',
  )
  .option(
    "-i, --id <id>",
    "ID of the extension or theme on the Chrome Web Store",
    {
      required: true,
      requiredValue: true,
      global: true,
    },
  )
  .option("-c, --client-id <client-id>", "Google API OAuth2 client ID", {
    required: true,
    requiredValue: true,
    global: true,
  })
  .option(
    "-s, --client-secret <client-secret>",
    "Google API OAuth2 client secret",
    {
      required: true,
      requiredValue: true,
      global: true,
    },
  )
  .option(
    "-r, --refresh-token <refresh-token>",
    "Google API OAuth2 refresh token",
    {
      required: true,
      requiredValue: true,
      global: true,
    },
  )
  .command(
    "upload",
    new Command()
      .description("Upload directory or ZIP file to Chrome Web Store")
      .option(
        "-f, --file <file>",
        "Path of directory or ZIP file to upload",
        {
          required: true,
          requiredValue: true,
        },
      )
      .option(
        "-p, --auto-publish [auto-publish:boolean]",
        "Automatically publish after upload",
      )
      .action(
        async (
          entry: {
            file: string;
            id: string;
            clientId: string;
            clientSecret: string;
            refreshToken: string;
            autoPublish?: boolean;
          },
        ): Promise<void> => {
          const debug = debugLog("cwc:upload");
          debug("parsed options %j", entry);

          const uploadResult = await upload({
            source: entry.file,
            extensionId: entry.id,
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
        },
      ),
  )
  .command(
    "publish",
    new Command()
      .description("Publish last upload to Chrome Web Store")
      .option(
        "-t, --trusted-testers [trusted-testers:boolean]",
        "Publish only to trusted testers",
      )
      .action(
        async (
          entry: {
            id: string;
            clientId: string;
            clientSecret: string;
            refreshToken: string;
            trustedTesters?: boolean;
          },
        ): Promise<void> => {
          const debug = debugLog("cwc:publish");
          debug("parsed options %j", entry);
          const publishResult = await publish({
            extensionId: entry.id,
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
        },
      ),
  );

if (import.meta.main) {
  try {
    const parsed = await cli.parse(Deno.args);
    if (parsed.args.length < 1 && Object.keys(parsed.options).length < 1) {
      throw new Error("No arguments provided!");
    }
  } catch (error) {
    console.error("Error –", error.message);
    cli.showHelp();
    Deno.exit(1);
  }
}
