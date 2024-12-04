export interface SuccessResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  status: number;
  message: Array<string>;
  error?: never;
}

export interface PaginationResponse<T> {
  items: T[];
  meta: {
    totalItem: number;
    currentPage: number;
    pageSize: number;
    totalPage: number;
  };
}

export class ErrorResponseException implements ErrorResponse {
  error?: never;
  status: number;
  message: Array<string>;
  originalRequest?: FetcherRequest<never>;

  constructor(
    status: number,
    message: Array<string>,
    error?: never,
    originalRequest?: FetcherRequest<never>
  ) {
    this.error = error;
    this.message = message;
    this.status = status;
    this.originalRequest = originalRequest;
  }
}

export interface FetcherRequest<Req> {
  baseUrl?: string;
  path: string;
  data?: Req;
  query?: { [key: string]: string | number };
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: RequestInit['headers'];
  options?: RequestInit;
}

const fetcher = async <Res, Req = never>({
  baseUrl,
  path,
  data,
  query,
  method = 'GET',
  headers = {},
  options,
}: FetcherRequest<Req>): Promise<SuccessResponse<Res>> => {
  let response: Response;
  let responseJSON: SuccessResponse<Res> | ErrorResponse;

  try {
    const apiUrl = baseUrl ? baseUrl : process.env.API_URL;

    const url = new URL(`${apiUrl}${path}`);

    if (query) {
      Object.keys(query).forEach((key) =>
        url.searchParams.append(key, query[key].toString())
      );
    }

    const dataBody = data
      ? data instanceof FormData
        ? data
        : JSON.stringify(data)
      : undefined;

    response = await fetch(url.href, {
      method: method,
      body: dataBody,
      credentials: 'same-origin',
      headers: {
        ...headers,
      },
      ...options,
    });

    responseJSON = await response.json();
  } catch (error) {
    console.error('Fetch error', error);
    throw new Error('Network Error');
  }

  if (!response.ok) {
    responseJSON = responseJSON as ErrorResponse;
    throw new ErrorResponseException(
      responseJSON.status as number,
      Array.isArray(responseJSON.message)
        ? responseJSON.message
        : [responseJSON.message],
      responseJSON.error,
      {
        baseUrl,
        path,
        data: data as never,
        query,
        method,
        headers,
        options,
      }
    );
  }

  return responseJSON as SuccessResponse<Res>;
};

export default fetcher;
