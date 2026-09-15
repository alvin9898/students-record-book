const API_URL = "https://students-record-book.onrender.com/api";

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function getStudents() {
  return apiRequest("/students");
}

export function getSubjects() {
  return apiRequest("/subjects");
}

export function createStudent(student) {
  return apiRequest("/students", {
    method: "POST",
    body: JSON.stringify(student),
  });
}

export function updateStudent(id, student) {
  return apiRequest(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
}

export function deleteStudent(id) {
  return apiRequest(`/students/${id}`, {
    method: "DELETE",
  });
}

export function createSubject(subject) {
  return apiRequest("/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
  });
}

export function deleteSubject(id) {
  return apiRequest(`/subjects/${id}`, {
    method: "DELETE",
  });
}