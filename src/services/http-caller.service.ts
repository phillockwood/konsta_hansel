class HttpCallerService {
  private baseURL: string;
  private commonHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${url}`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  public get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: 'GET', ...config });
  }

  public post<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { ...this.commonHeaders, ...config?.headers },
      ...config,
    });
  }

  public login<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data,
      headers: {
        ...this.commonHeaders,
        ...config?.headers, 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      ...config,
    });
  }

  public put<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data,
      headers: { ...this.commonHeaders, ...config?.headers },
      ...config,
    });
  }

  public delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', ...config });
  }
}

export default HttpCallerService;
