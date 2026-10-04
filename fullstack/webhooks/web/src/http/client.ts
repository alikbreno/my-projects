const API_BASE_URL ='https://webhookinspectorapi.onrender.com'

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(new URL(path, `${API_BASE_URL}/`), init)

  if (!response.ok) {
    throw new Error(`HTTP request failed with status ${response.status}`)
  }

  return response
}
