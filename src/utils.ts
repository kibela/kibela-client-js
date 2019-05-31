
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

export function getEnv(name: string): string | undefined {
  if (typeof process === "undefined") {
    throw new Error("No process.env available");
  }
  return process.env[name];
}

