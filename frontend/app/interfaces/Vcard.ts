export interface CardContent {
  title: string;
  content: {[x: string]: any} | null;
}

export interface CardNotFound {
  title: string;
  value: string;
}
