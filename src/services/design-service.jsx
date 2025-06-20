import { fetchWithAuth } from "./base-service";

export async function getUserDesigns() {
  return fetchWithAuth("/designs");
}

export async function getUserDesignByID(id) {
  return fetchWithAuth(`/designs/${id}`);
}

export async function saveDesign(designData, designId = null) {
  return fetchWithAuth(`/designs`, {
    method: "POST",
    body: { ...designData, designId },
  });
}

export async function deleteDesign(id) {
  return fetchWithAuth(`/designs/${id}`, { method: "DELETE" });
}

export async function saveCanvasState(
  canvas,
  designId = null,
  title = "Untitled Design"
) {
  if (!canvas) return false;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const designData = {
      name: title,
      canvasData: JSON.stringify(canvasData),
      width: canvas.width,
      height: canvas.height,
    };

    return saveDesign(designData, designId);
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}

//  Correct updateDesignName function using fetchWithAuth
export async function updateDesignName(id, name) {
  return fetchWithAuth(`/designs/${id}`, {
    method: "PUT",
    body: { name },
  });
}
