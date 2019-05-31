import * as msgpack from "@msgpack/msgpack";

export const FORMAT_JSON = "application/json";
export const FORMAT_MSGPACK = "application/x-msgpack";
export type FormatType = typeof FORMAT_JSON | typeof FORMAT_MSGPACK;

export class Serializer {
  public serialize(mimeType: string, body: object) {
    if (mimeType === FORMAT_MSGPACK) {
      return msgpack.encode(body);
    } else if (mimeType === FORMAT_JSON) {
      return JSON.stringify(body);
    } else {
      throw new Error(`Unrecognized MIME type: ${mimeType}`);
    }
  }

  public async deserialize(mimeType: string, response: Response): Promise<any> {
    if (response.body == null) {
      return {
        errors: [
          {
            message: "Empty content body",
            extensions: {
              code: "KibelaClient.INVALID_RESPONSE_BODY"
            }
          }
        ]
      };
    }

    if (mimeType === FORMAT_MSGPACK) {
        return msgpack.decodeAsync(response.body);
    } else if (mimeType === FORMAT_JSON) {
      return response.json();
    } else {
      // While Kibela is in maintenance mode, it may return text/html or text/plain for the API endpoint.
      return {
        errors: [
          {
            message: `Unrecognized content-type: ${mimeType}`,
            extensions: {
              code: "KibelaClient.UNRECOGNIZED_CONTENT_TYPE",
              contentType: mimeType,
              body: mimeType.startsWith("text/")
                ? await response.text()
                : new Uint8Array(await response.arrayBuffer())
            }
          }
        ]
      };
    }
  }
}
