/**
 * Copied from https://deno.land/std@0.126.0/http/file_server.ts
 * passes file and fileInfo to serveFile in order to return 404
 * rather than 500
 */

import { extname, Status, STATUS_TEXT } from "./deps.ts";

const DEFAULT_CHUNK_SIZE = 16_640;

function setBaseHeaders(): Headers {
  const headers = new Headers();
  headers.set("server", "deno");

  // Set "accept-ranges" so that the client knows it can make range requests on future requests
  headers.set("accept-ranges", "bytes");
  headers.set("date", new Date().toUTCString());

  return headers;
}

const encoder = new TextEncoder();

const MEDIA_TYPES: Record<string, string> = {
  ".md": "text/markdown",
  ".html": "text/html",
  ".htm": "text/html",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain",
  ".ts": "text/typescript",
  ".tsx": "text/tsx",
  ".js": "application/javascript",
  ".jsx": "text/jsx",
  ".gz": "application/gzip",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".mjs": "application/javascript",
  ".otf": "font/otf",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".conf": "text/plain",
  ".list": "text/plain",
  ".log": "text/plain",
  ".ini": "text/plain",
  ".vtt": "text/vtt",
  ".yaml": "text/yaml",
  ".yml": "text/yaml",
  ".mid": "audio/midi",
  ".midi": "audio/midi",
  ".mp3": "audio/mp3",
  ".mp4a": "audio/mp4",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".spx": "audio/ogg",
  ".opus": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
  ".aac": "audio/x-aac",
  ".flac": "audio/x-flac",
  ".mp4": "video/mp4",
  ".mp4v": "video/mp4",
  ".mkv": "video/x-matroska",
  ".mov": "video/quicktime",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".tiff": "image/tiff",
  ".psd": "image/vnd.adobe.photoshop",
  ".ico": "image/vnd.microsoft.icon",
  ".webp": "image/webp",
  ".es": "application/ecmascript",
  ".epub": "application/epub+zip",
  ".jar": "application/java-archive",
  ".war": "application/java-archive",
  ".webmanifest": "application/manifest+json",
  ".doc": "application/msword",
  ".dot": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".dotx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  ".cjs": "application/node",
  ".bin": "application/octet-stream",
  ".pkg": "application/octet-stream",
  ".dump": "application/octet-stream",
  ".exe": "application/octet-stream",
  ".deploy": "application/octet-stream",
  ".img": "application/octet-stream",
  ".msi": "application/octet-stream",
  ".pdf": "application/pdf",
  ".pgp": "application/pgp-encrypted",
  ".asc": "application/pgp-signature",
  ".sig": "application/pgp-signature",
  ".ai": "application/postscript",
  ".eps": "application/postscript",
  ".ps": "application/postscript",
  ".rdf": "application/rdf+xml",
  ".rss": "application/rss+xml",
  ".rtf": "application/rtf",
  ".apk": "application/vnd.android.package-archive",
  ".key": "application/vnd.apple.keynote",
  ".numbers": "application/vnd.apple.keynote",
  ".pages": "application/vnd.apple.pages",
  ".geo": "application/vnd.dynageo",
  ".gdoc": "application/vnd.google-apps.document",
  ".gslides": "application/vnd.google-apps.presentation",
  ".gsheet": "application/vnd.google-apps.spreadsheet",
  ".kml": "application/vnd.google-earth.kml+xml",
  ".mkz": "application/vnd.google-earth.kmz",
  ".icc": "application/vnd.iccprofile",
  ".icm": "application/vnd.iccprofile",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xlm": "application/vnd.ms-excel",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pot": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".potx":
    "application/vnd.openxmlformats-officedocument.presentationml.template",
  ".xps": "application/vnd.ms-xpsdocument",
  ".odc": "application/vnd.oasis.opendocument.chart",
  ".odb": "application/vnd.oasis.opendocument.database",
  ".odf": "application/vnd.oasis.opendocument.formula",
  ".odg": "application/vnd.oasis.opendocument.graphics",
  ".odp": "application/vnd.oasis.opendocument.presentation",
  ".ods": "application/vnd.oasis.opendocument.spreadsheet",
  ".odt": "application/vnd.oasis.opendocument.text",
  ".rar": "application/vnd.rar",
  ".unityweb": "application/vnd.unity",
  ".dmg": "application/x-apple-diskimage",
  ".bz": "application/x-bzip",
  ".crx": "application/x-chrome-extension",
  ".deb": "application/x-debian-package",
  ".php": "application/x-httpd-php",
  ".iso": "application/x-iso9660-image",
  ".sh": "application/x-sh",
  ".sql": "application/x-sql",
  ".srt": "application/x-subrip",
  ".xml": "application/xml",
  ".zip": "application/zip",
};

/** Returns the content-type based on the extension of a path. */
function contentType(path: string): string | undefined {
  return MEDIA_TYPES[extname(path)];
}

// Generates a SHA-1 hash for the provided string
async function createEtagHash(message: string) {
  const byteToHex = (b: number) => b.toString(16).padStart(2, "00");
  const hashType = "SHA-1"; // Faster, and this isn't a security sensitive cryptographic use case

  // see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const msgUint8 = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest(hashType, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byteToHex).join("");
  return hashHex;
}

export async function serveFile(
  req: Request,
  filePath: string,
  file: Deno.File,
  fileInfo: Deno.FileInfo,
): Promise<Response> {
  const headers = setBaseHeaders();

  // Set mime-type using the file extension in filePath
  const contentTypeValue = contentType(filePath);
  if (contentTypeValue) {
    headers.set("content-type", contentTypeValue);
  }

  // Set date header if access timestamp is available
  if (fileInfo.atime instanceof Date) {
    const date = new Date(fileInfo.atime);
    headers.set("date", date.toUTCString());
  }

  // Set last modified header if access timestamp is available
  if (fileInfo.mtime instanceof Date) {
    const lastModified = new Date(fileInfo.mtime);
    headers.set("last-modified", lastModified.toUTCString());

    // Create a simple etag that is an md5 of the last modified date and filesize concatenated
    const simpleEtag = await createEtagHash(
      `${lastModified.toJSON()}${fileInfo.size}`,
    );
    headers.set("etag", simpleEtag);

    // If a `if-none-match` header is present and the value matches the tag or
    // if a `if-modified-since` header is present and the value is bigger than
    // the access timestamp value, then return 304
    const ifNoneMatch = req.headers.get("if-none-match");
    const ifModifiedSince = req.headers.get("if-modified-since");
    if (
      (ifNoneMatch && ifNoneMatch === simpleEtag) ||
      (ifNoneMatch === null && ifModifiedSince &&
        fileInfo.mtime.getTime() < (new Date(ifModifiedSince).getTime() + 1000))
    ) {
      const status = Status.NotModified;
      const statusText = STATUS_TEXT.get(status);

      file.close();

      return new Response(null, {
        status,
        statusText,
        headers,
      });
    }
  }

  // Get and parse the "range" header
  const range = req.headers.get("range") as string;
  const rangeRe = /bytes=(\d+)-(\d+)?/;
  const parsed = rangeRe.exec(range);

  // Use the parsed value if available, fallback to the start and end of the entire file
  const start = parsed && parsed[1] ? +parsed[1] : 0;
  const end = parsed && parsed[2] ? +parsed[2] : fileInfo.size - 1;

  let status = Status.OK;

  // If there is a range, set the status to 206, and set the "Content-range" header.
  if (range && parsed) {
    status = Status.PartialContent;
    headers.set("content-range", `bytes ${start}-${end}/${fileInfo.size}`);
  }

  // Return 416 if `start` isn't less than or equal to `end`, or `start` or `end` are greater than the file's size
  const maxRange = fileInfo.size - 1;

  if (
    range && (!parsed ||
      typeof start !== "number" || start > end || start > maxRange ||
      end > maxRange)
  ) {
    const status = Status.RequestedRangeNotSatisfiable;
    const statusText = STATUS_TEXT.get(status);

    file.close();

    return new Response(statusText, {
      status,
      statusText,
      headers,
    });
  }

  // Set content length
  const contentLength = end - start + 1;
  headers.set("content-length", `${contentLength}`);

  // Create a stream of the file instead of loading it into memory
  let bytesSent = 0;
  const body = new ReadableStream({
    async start() {
      await file.seek(start, Deno.SeekMode.Start);
    },
    async pull(controller) {
      const bytes = new Uint8Array(DEFAULT_CHUNK_SIZE);
      const bytesRead = await file.read(bytes);
      if (bytesRead === null) {
        file.close();
        controller.close();
        return;
      }
      controller.enqueue(
        bytes.slice(0, Math.min(bytesRead, contentLength - bytesSent)),
      );
      bytesSent += bytesRead;
      if (bytesSent > contentLength) {
        file.close();
        controller.close();
      }
    },
  });

  const statusText = STATUS_TEXT.get(status);

  return new Response(body, {
    status,
    statusText,
    headers,
  });
}
