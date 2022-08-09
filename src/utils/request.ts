function parseJSON (response: Response) {
  return response.json();
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error: any = new Error(response.statusText);
  error.response = response;
  throw error;
}

type IResponse<T> = {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
}

function handleCode<T, R>(res: IResponse<T>, resolve: (value: IResponse<R> | PromiseLike<IResponse<R>>) => void) {
  if (res.code) {
    resolve({
      success: false,
      code: res.code,
      message: res.message,
    });
  }
}

export default function request<T>(url: string, options?: RequestInit): Promise<IResponse<T>> {
  options = options || {
    headers:{
      'Accept-Language': 'en-US'
    }
  };

  return new Promise(resolve => {
    return fetch(url, options)
      .then(response => checkStatus(response))
      .then(response => parseJSON(response))
      .then(response => {
        handleCode<IResponse<T>, T>(response, resolve);
        resolve({
          success: true,
          data: response,
        });
      })
      .catch(err => {
        resolve({
          code: err.response.status,
          success: false,
          message: err.message,
        });
      });
  });
}
