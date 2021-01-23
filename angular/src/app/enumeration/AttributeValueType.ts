export enum AttributeValueType {
  TEXT = "TEXT", IMAGE = "IMAGE", RICH_TEXT = "RICH_TEXT", IMAGE_SET = "IMAGE_SET", BOOLEAN = "BOOLEAN", CATEGORY = "CATEGORY"
}

export class AttributeValueTypeTool {
  static readonly translatedValues = [
    {name: "文本", value: AttributeValueType.TEXT},
    {name: "图片", value: AttributeValueType.IMAGE},
    {name: "富文本", value: AttributeValueType.RICH_TEXT},
    {name: "多图片", value: AttributeValueType.IMAGE_SET},
    {name: "开关", value: AttributeValueType.BOOLEAN},
    {name: "类别", value: AttributeValueType.CATEGORY}
  ]
}
