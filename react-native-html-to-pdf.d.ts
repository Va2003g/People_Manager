declare module "react-native-html-to-pdf" {
  interface Options {
    html: string;
    fileName?: string;
    directory?: string;
    height?: number;
    width?: number;
    base64?: boolean;
    padding?: number;
  }

  interface PDF {
    filePath: string;
    base64: string;
  }

  export function convert(options: Options): Promise<PDF>;
}
