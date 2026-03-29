// New storage.ts — API helper layer
const BASE_URL = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("accessToken");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getAll(resource: string) {
  const res = await fetch(`${BASE_URL}/${resource}/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
  const data = await res.json();
  return data.results ?? data; // handles paginated + non-paginated
}

export async function createOne(resource: string, body: object) {
  const res = await fetch(`${BASE_URL}/${resource}/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create ${resource}`);
  return res.json();
}

export async function updateOne(resource: string, id: number, body: object) {
  const res = await fetch(`${BASE_URL}/${resource}/${id}/`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to update ${resource}`);
  return res.json();
}

export async function deleteOne(resource: string, id: number) {
  const res = await fetch(`${BASE_URL}/${resource}/${id}/`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete ${resource}`);
}
