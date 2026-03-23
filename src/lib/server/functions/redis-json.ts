export function redisSerialize(value: unknown) {
  return JSON.stringify(value, (_key, currentValue) => {
    if (typeof currentValue === "bigint") {
      return { __nypsiType: "bigint", value: currentValue.toString() };
    }

    return currentValue;
  });
}

export function redisDeserialize<T>(value: string): T {
  return JSON.parse(value, (_key, currentValue) => {
    if (
      currentValue &&
      typeof currentValue === "object" &&
      "__nypsiType" in currentValue &&
      currentValue.__nypsiType === "bigint" &&
      "value" in currentValue
    ) {
      return BigInt(currentValue.value as string);
    }
    return currentValue;
  }) as T;
}
