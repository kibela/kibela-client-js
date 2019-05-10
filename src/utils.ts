export function isAsyncIterable<T>(stream: object): stream is AsyncIterable<T> {
  return !!stream[Symbol.asyncIterator];
}

export async function* asyncIterableFromStream(
  stream: ReadableStream<Uint8Array> | AsyncIterable<Uint8Array> | null,
) {
  if (stream == null) {
    return;
  }

  // node-fetch
  if (isAsyncIterable(stream)) {
    for await (const buffer of stream) {
      yield buffer;
    }
    return;
  }

  // WHATWG fetch (not an async iterators)
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export function sleep(value: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, value);
  });
}

export function normalizeMimeType(type: string | null): string | null {
  if (type) {
    return type
      .split(/;/)[0]
      .trim()
      .toLocaleLowerCase();
  } else {
    return type;
  }
}

export function ensureNonNull<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(`non-null value is expected: ${message}`);
  }

  return value;
}

export function ensureStringIsPresent(value: string | null | undefined, message: string): string {
  if (value == null || value.trim().length === 0) {
    throw new Error(`non-empty string is expected: ${message}`);
  }

  return value;
}

declare var process: { env: Record<string, string> };

export function getEnv(name: string): string {
  if (typeof process === "undefined") {
    throw new Error("No process.env available");
  }
  return ensureNonNull(process.env[name], name);
}

