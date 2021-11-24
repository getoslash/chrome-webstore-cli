import { assertEquals, resolvesNext, stub } from "../dev_deps.ts";
import {
  isPublishError,
  isPublishSuccess,
  publish,
  upload,
} from "../helpers/api.ts";
import type { Stub } from "../dev_deps.ts";
import type {
  GoogleAPIWebStorePublishFailure,
  GoogleAPIWebStorePublishSuccess,
} from "../deps.ts";

Deno.test({
  name: "upload() > should upload file to Chrome Web Store",
  sanitizeResources: false, // Because the file readable stream won't get read by the fetch stub.
  fn: async () => {
    const fixtures = {
      uploadOptions: {
        extensionId: "c",
        clientId: "a",
        clientSecret: "b",
        refreshToken: "d",
        source: "./tests/fixtures/extension.zip",
      },
    } as const;

    const mockResponses = [
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              "UPLOAD_STATE": "SUCCESS",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
    ];

    const responses = async function* () {
      yield* mockResponses;
    };

    const fetchStub: Stub<typeof globalThis> = stub(
      globalThis,
      "fetch",
      resolvesNext(responses()),
    );

    const uploadResult = await upload(fixtures.uploadOptions);

    assertEquals(
      fetchStub.calls[0].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(fetchStub.calls[0].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[0].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );

    assertEquals(
      fetchStub.calls[1].args[0],
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}`,
    );
    assertEquals(fetchStub.calls[1].args[1].method, "PUT");
    assertEquals(
      fetchStub.calls[1].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(uploadResult, {
      upload: { UPLOAD_STATE: "SUCCESS" },
    });
    fetchStub.restore();
  },
});

Deno.test({
  name:
    "upload() > should upload ZIP directory and upload it to Chrome Web Store",
  sanitizeResources: false, // Because the file readable stream won't get read by the fetch stub.
  fn: async () => {
    const fixtures = {
      uploadOptions: {
        extensionId: "c",
        clientId: "a",
        clientSecret: "b",
        refreshToken: "d",
        source: "./tests/fixtures/extension",
      },
    } as const;

    const mockResponses = [
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              "UPLOAD_STATE": "SUCCESS",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
    ];

    const responses = async function* () {
      yield* mockResponses;
    };

    const fetchStub: Stub<typeof globalThis> = stub(
      globalThis,
      "fetch",
      resolvesNext(responses()),
    );

    const uploadResult = await upload(fixtures.uploadOptions);

    assertEquals(
      fetchStub.calls[0].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(fetchStub.calls[0].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[0].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );

    assertEquals(
      fetchStub.calls[1].args[0],
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}`,
    );
    assertEquals(fetchStub.calls[1].args[1].method, "PUT");
    assertEquals(
      fetchStub.calls[1].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(uploadResult, {
      upload: { UPLOAD_STATE: "SUCCESS" },
    });
    fetchStub.restore();
  },
});

Deno.test({
  name: "upload() > should upload file to Chrome Web Store and auto-publish it",
  sanitizeResources: false, // Because the file readable stream won't get read by the fetch stub.
  fn: async () => {
    const fixtures = {
      uploadOptions: {
        extensionId: "c",
        clientId: "a",
        clientSecret: "b",
        refreshToken: "d",
        source: "./tests/fixtures/extension.zip",
        autoPublish: true,
      },
    } as const;

    const mockResponses = [
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              "UPLOAD_STATE": "SUCCESS",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              "status": ["OK"],
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
    ];

    const responses = async function* () {
      yield* mockResponses;
    };

    const fetchStub: Stub<typeof globalThis> = stub(
      globalThis,
      "fetch",
      resolvesNext(responses()),
    );

    const uploadResult = await upload(fixtures.uploadOptions);

    assertEquals(
      fetchStub.calls[0].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(
      fetchStub.calls[2].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(fetchStub.calls[0].args[1].method, "POST");
    assertEquals(fetchStub.calls[2].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[0].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );
    assertEquals(
      fetchStub.calls[2].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );

    assertEquals(
      fetchStub.calls[1].args[0],
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}`,
    );
    assertEquals(fetchStub.calls[1].args[1].method, "PUT");
    assertEquals(
      fetchStub.calls[1].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(
      fetchStub.calls[3].args[0],
      `https://www.googleapis.com/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}/publish?publishTarget=default`,
    );
    assertEquals(fetchStub.calls[3].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[3].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(uploadResult, {
      "upload": {
        "UPLOAD_STATE": "SUCCESS",
      },
      "publish": {
        "status": [
          "OK",
        ],
      },
    });

    fetchStub.restore();
  },
});

Deno.test({
  name: "publish() > should publish to Chrome Web Store",
  sanitizeResources: false, // Because the file readable stream won't get read by the fetch stub.
  fn: async () => {
    const fixtures = {
      uploadOptions: {
        extensionId: "c",
        clientId: "a",
        clientSecret: "b",
        refreshToken: "d",
        source: "./tests/fixtures/extension.zip",
      },
    } as const;

    const mockResponses = [
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              kind: "chromewebstore#item",
              "item_id": fixtures.uploadOptions.extensionId,
              "status": ["OK"],
              "statusDetail": "Publish successful",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
    ];

    const responses = async function* () {
      yield* mockResponses;
    };

    const fetchStub: Stub<typeof globalThis> = stub(
      globalThis,
      "fetch",
      resolvesNext(responses()),
    );

    const publishResult = await publish(fixtures.uploadOptions);

    assertEquals(
      fetchStub.calls[0].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(fetchStub.calls[0].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[0].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );

    assertEquals(
      fetchStub.calls[1].args[0],
      `https://www.googleapis.com/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}/publish?publishTarget=default`,
    );
    assertEquals(fetchStub.calls[1].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[1].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(publishResult, {
      kind: "chromewebstore#item",
      "item_id": fixtures.uploadOptions.extensionId,
      "status": ["OK"],
      "statusDetail": "Publish successful",
    });

    fetchStub.restore();
  },
});

Deno.test({
  name:
    "publish() > should publish to Chrome Web Store only to trusted testers",
  sanitizeResources: false, // Because the file readable stream won't get read by the fetch stub.
  fn: async () => {
    const fixtures = {
      uploadOptions: {
        extensionId: "c",
        clientId: "a",
        clientSecret: "b",
        refreshToken: "d",
        source: "./tests/fixtures/extension.zip",
        trustedTesters: true,
      },
    } as const;

    const mockResponses = [
      new Response(
        new Blob([
          JSON.stringify(
            {
              "access_token": "xyz",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
      new Response(
        new Blob([
          JSON.stringify(
            {
              kind: "chromewebstore#item",
              "item_id": fixtures.uploadOptions.extensionId,
              "status": ["OK"],
              "statusDetail": "Publish successful",
            },
            null,
            2,
          ),
        ], { type: "application/json" }),
      ),
    ];

    const responses = async function* () {
      yield* mockResponses;
    };

    const fetchStub: Stub<typeof globalThis> = stub(
      globalThis,
      "fetch",
      resolvesNext(responses()),
    );

    const publishResult = await publish(fixtures.uploadOptions);

    assertEquals(
      fetchStub.calls[0].args[0],
      "https://www.googleapis.com/oauth2/v4/token",
    );
    assertEquals(fetchStub.calls[0].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[0].args[1].body,
      JSON.stringify({
        client_id: fixtures.uploadOptions.clientId,
        client_secret: fixtures.uploadOptions.clientSecret,
        refresh_token: fixtures.uploadOptions.refreshToken,
        grant_type: "refresh_token",
      }),
    );

    assertEquals(
      fetchStub.calls[1].args[0],
      `https://www.googleapis.com/chromewebstore/v1.1/items/${fixtures.uploadOptions.extensionId}/publish?publishTarget=trustedUsers`,
    );
    assertEquals(fetchStub.calls[1].args[1].method, "POST");
    assertEquals(
      fetchStub.calls[1].args[1].headers,
      {
        "Authorization": "Bearer xyz",
        "x-goog-api-version": "2",
      },
    );

    assertEquals(publishResult, {
      kind: "chromewebstore#item",
      "item_id": fixtures.uploadOptions.extensionId,
      "status": ["OK"],
      "statusDetail": "Publish successful",
    });

    fetchStub.restore();
  },
});

Deno.test({
  name:
    "isPublishSuccess() & isPublishError() type-guards > should correctly test if a given Publish response is success or failure",
  fn: () => {
    const fixtures = {
      successResponse: {
        kind: "chromewebstore#item",
        item_id: "abc",
        status: ["OK"],
        statusDetail: ["Publish OK"],
      } as GoogleAPIWebStorePublishSuccess,
      errorResponse: {
        error: {
          code: 400,
          message: "Invalid version number in manifest: 1.0",
          errors: [
            {
              message:
                "Please make sure the newly uploaded package has a larger version in file manifest.json than the published package: 1.0.",
              domain: "PUBLISH",
              reason: "INVALID_VERSION_NUMBER",
            },
          ],
        },
      } as GoogleAPIWebStorePublishFailure,
    };
    assertEquals(isPublishError(fixtures.successResponse), false);
    assertEquals(isPublishError(fixtures.errorResponse), true);
    assertEquals(isPublishSuccess(fixtures.successResponse), true);
    assertEquals(isPublishSuccess(fixtures.errorResponse), false);
  },
});
