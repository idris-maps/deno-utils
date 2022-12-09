import type { Req } from "./types.d.ts";

const getQuery = (url: URL) => {
  const params = new URLSearchParams(url.search);
  const data: { [key: string]: string } = {};
  Array.from(params.entries()).forEach(([key, value]) => {
    data[key] = value;
  });
  return data;
};

const isFile = (d: FormDataEntryValue): d is File => String(d) !== d;

interface ReqBody {
  data: { [key: string]: unknown };
  files: File[];
}

const getBody = async (request: Request): Promise<ReqBody> => {
  const type = request.headers.get("content-type");

  if (type === "application/json") {
    try {
      return { data: await request.json(), files: [] };
    } catch {
      return { data: {}, files: [] };
    }
  }

  if (type === "application/x-www-form-urlencoded") {
    const form = await request.formData();
    const data: { [key: string]: string } = {};
    const files: File[] = [];

    form.forEach((value, key) => {
      if (isFile(value)) {
        files.push(value);
      } else {
        data[key] = value;
      }
    });
    return { data, files };
  }
  return { data: {}, files: [] };
};

export default async (
  request: Request,
  requestId: string,
): Promise<Req> => {
  const { data, files } = await getBody(request);
  const url = new URL(request.url);

  return {
    data,
    files,
    headers: request.headers,
    method: request.method,
    params: {},
    query: getQuery(url),
    request,
    requestId,
    url: new URL(request.url),
  };
};
