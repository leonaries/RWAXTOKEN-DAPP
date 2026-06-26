export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

export type MockListResponse<T> = {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
};

export function wait(ms = 260) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function mockResolve<T>(data: T, ms?: number) {
  if (typeof window !== "undefined") {
    await wait(ms);
  }

  return data;
}

export function createMockList<T>(list: T[], page = 1, pageSize = 10): MockListResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length
  };
}
