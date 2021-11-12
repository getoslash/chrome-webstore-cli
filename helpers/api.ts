import { apiClient, debugLog } from "../deps.ts";
import { prepareFilesOrDirectoryForUpload } from "./uploadable.ts";
import { getStream } from "../utils/io.ts";
import type { GoogleAPIWebStorePublishSuccess } from "../deps.ts";
import type { GoogleAPIWebStorePublishFailure } from "../deps.ts";
import type { GoogleAPIWebStoreItem } from "../deps.ts";
import type { GoogleAPIWebStorePublishResponse } from "../deps.ts";

export interface UploadOptions {
  source: string;
  extensionId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  autoPublish?: boolean;
}

export interface UploadResults {
  upload: GoogleAPIWebStoreItem;
  publish?: GoogleAPIWebStorePublishResponse;
}

export interface PublishOptions {
  extensionId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  trustedTesters?: boolean;
}

export type PublishResult = GoogleAPIWebStorePublishResponse;

export const isPublishError = (
  publishResponse:
    | GoogleAPIWebStorePublishFailure
    | GoogleAPIWebStorePublishSuccess
    | undefined,
): publishResponse is GoogleAPIWebStorePublishFailure => {
  return (publishResponse as GoogleAPIWebStorePublishFailure).error !==
    undefined;
};

export const isPublishSuccess = (
  publishResponse:
    | GoogleAPIWebStorePublishFailure
    | GoogleAPIWebStorePublishSuccess
    | undefined,
): publishResponse is GoogleAPIWebStorePublishSuccess => {
  return (publishResponse as GoogleAPIWebStorePublishSuccess)?.status !==
    undefined;
};

/**
 * Upload a file to the Web Store.
 * Optionally, auto-publish it.
 * Finally cleans up the generated ZIP file. Does not touch the source file if it was already zipped.
 */
export const upload = async (
  options: UploadOptions,
): Promise<UploadResults> => {
  const results = {} as UploadResults;
  const debug = debugLog("cwc:helpers:api");

  const uploadable = await prepareFilesOrDirectoryForUpload(options.source);
  debug("got file to upload %j", uploadable);
  const uploadStream = await getStream(uploadable.filePath);

  const api = apiClient({
    id: options.extensionId,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    refreshToken: options.refreshToken,
  });

  results.upload = await api.uploadExisting(uploadStream);
  if (uploadable.cleanupRequired) {
    await Deno.remove(uploadable.filePath);
    debug("cleaned up file after upload %s", uploadable.filePath);
  }

  if (options.autoPublish) {
    debug("auto-publishing upload to chrome store");
    results.publish = await api.publish();
    debug("completed auto-publishing upload to chrome store");
  }

  debug("upload results %j", results);
  return results as UploadResults;
};

/**
 * Publish an item on the Web Store.
 */
export const publish = async (
  options: PublishOptions,
): Promise<PublishResult> => {
  const debug = debugLog("cwc:helpers:api");
  const api = apiClient({
    id: options.extensionId,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    refreshToken: options.refreshToken,
  });

  debug(
    `publishing to chrome store${
      options.trustedTesters
        ? " for only trusted testers"
        : ""
    }`,
  );
  const result = await api.publish(
    options.trustedTesters ? "trustedUsers" : undefined,
  );
  debug("completed publishing to chrome store");

  debug("publish response %j", result);
  return result;
};
