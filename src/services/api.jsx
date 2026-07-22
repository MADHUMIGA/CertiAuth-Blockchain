const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000"

export const api = {

  // -------------------------
  // UNIVERSITY
  // -------------------------

  issueCertificate: async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${BASE_URL}/university/issue`, {
      method: "POST",
      body: formData,
    })

    return response.json()
  },

  reissueCertificate: async (oldCertHash, file) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("oldCertHash", oldCertHash)

    const response = await fetch(`${BASE_URL}/university/reissue`, {
      method: "POST",
      body: formData,
    })

    return response.json()
  },

 suspendCertificate: async (certHash) => {
  const response = await fetch(`${BASE_URL}/university/suspend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certHash }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Suspend failed");
  }

  return data;
},

revokeCertificate: async (certHash) => {
  const response = await fetch(`${BASE_URL}/university/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certHash }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Revoke failed");
  }

  return data;
},

  // -------------------------
// ADMIN LISTING
// -------------------------

getAllCertificates: async () => {
  const response = await fetch(`${BASE_URL}/admin/certificates`)
  return response.json()
},

  // -------------------------
  // COMPANY
  // -------------------------

  verifyCertificate: async (certHash) => {
    const response = await fetch(`${BASE_URL}/company/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ certHash }),
    })

    return response.json()
  },
}