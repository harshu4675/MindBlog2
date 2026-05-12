const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("mindblog-token");

const handleResponse = async (res) => {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      (isJson && (data.message || data.error)) ||
      res.statusText ||
      "Something went wrong";
    throw new Error(message);
  }
  return data;
};

const buildHeaders = (auth = false, isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: (endpoint, auth = false) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: buildHeaders(auth),
    }).then(handleResponse),

  post: (endpoint, body, auth = false) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (endpoint, body, auth = false) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (endpoint, body, auth = false) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: buildHeaders(auth),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (endpoint, auth = false) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: buildHeaders(auth),
    }).then(handleResponse),

  upload: (endpoint, formData, auth = true) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: buildHeaders(auth, true),
      body: formData,
    }).then(handleResponse),
};
