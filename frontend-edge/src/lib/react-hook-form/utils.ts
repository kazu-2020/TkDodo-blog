type UnknownArrayOrObject = unknown[] | Record<string, unknown>

export const dirtyValues = (
  dirtyFields: UnknownArrayOrObject | boolean,
  allValues: UnknownArrayOrObject
): UnknownArrayOrObject => {
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues
  }

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) =>
      // @ts-ignore
      [key, dirtyValues(dirtyFields[key], allValues[key])]
    )
  )
}
