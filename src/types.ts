export interface DeclarationInfo {
  module: string;
  title: string;
  type: "declaration";
  typeOrValue: "ValueLevel" | "TypeLevel";
  typeText: string;
}

export interface PackageInfo {
  deprecated: boolean;
  type: "package";
}

export type ItemInfo = DeclarationInfo | PackageInfo;

export interface SearchItem {
  info: ItemInfo;
  markup: string;
  package: string;
  text: string;
  url: string;
  version: string;
}
