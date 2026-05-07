import { PropertyType } from "~/stores/propertiesStore"

const convertibleTypes1 = [
  "SINGLE_LINE_TEXT",
  "MULTI_LINE_TEXT",
]

const convertibleTypes2 = [
  "SINGLE_SELECT",
  "MULTI_SELECT",
]

export const isPropertyConvertible = (from: PropertyType, to: PropertyType) => {
  if (convertibleTypes1.includes(from) && convertibleTypes1.includes(to)) {
    return true
  }

  if (convertibleTypes2.includes(from) && convertibleTypes2.includes(to)) {
    return true
  }

  return false
}