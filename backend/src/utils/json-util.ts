
export function fromJson<T>(json: string): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function toJson<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    throw new Error(`Failed to convert to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}