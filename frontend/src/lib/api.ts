const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function fetcher(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "An error occurred" }))
        throw new Error(error.message || "Failed to fetch")
    }

    return response.json()
}

export const negotiationApi = {
    create: (data: any) => fetcher("/api/negotiation/start", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    getSession: (id: string) => fetcher(`/api/negotiation/${id}`),
}
