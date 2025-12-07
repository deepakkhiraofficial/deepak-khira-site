export function safeJSON(str: string) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }
  
  export function serverFetch(url: string, revalidate = 60) {
    return fetch(url, {
      next: { revalidate },
    }).then(r => r.json());
  }
  