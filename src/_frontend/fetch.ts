export const fetcher = <T>(path: string): Promise<T> =>
  fetch("/api" + path).then((res: Response) => res.json());
