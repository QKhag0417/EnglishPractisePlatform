import { API_BASE } from "../../../env";
import { Question } from "../types";

export function useListeningEditorApi() {

  const fetchDetail = async (id: string) => {
    const res = await fetch(
      `${API_BASE}/api/practice-content/${id}`,
      { credentials: "include" }
    );

    if (!res.ok) throw new Error("Failed to load");

    const result = await res.json();
    return result.data;
  };

  const saveContent = async (
    payload: any,
    isEditMode: boolean,
    editId?: string
  ) => {
    const url = isEditMode
      ? `${API_BASE}/api/practice-content/${editId}`
      : `${API_BASE}/api/practice-content`;

    const method = isEditMode ? "PUT" : "POST";

  // 🔥 IN RA PAYLOAD TRƯỚC KHI GỬI
  console.log("=== SAVE CONTENT DEBUG ===");
  console.log("URL:", url);
  console.log("Method:", method);
  console.log("Payload object:", payload);
  console.log("Payload JSON:", JSON.stringify(payload, null, 2));

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt);
    }

    return await res.json();
  };

  return {
    fetchDetail,
    saveContent,
  };
}