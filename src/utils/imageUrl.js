/**
 * Resolve public storage URL for applicant photos and uploaded assets.
 * Handles paths whether stored as 'applicants/photos/...', '/storage/...', or full HTTP URLs.
 * 
 * @param {string|null} path 
 * @returns {string|null}
 */
export function getStorageUrl(path) {
  if (!path) return null;

  // If already an absolute URL or base64 data URI, return as-is
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const rawStorageUrl = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";
  let storageBase = rawStorageUrl.replace(/\/$/, "");

  // Local development host check
  if (storageBase === "http://localhost" || storageBase === "localhost") {
    storageBase = "http://localhost:8000/storage";
  }

  // Strip any accidental leading slashes or 'storage/' prefixes
  const cleanPath = path.replace(/^\/?(app\/public\/|storage\/)?/, "");

  return `${storageBase}/${cleanPath}`;
}
