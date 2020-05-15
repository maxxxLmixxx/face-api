export default async function http_postRequest(o) {
    const response = await fetch(`${o.baseUrl}${o.serviceUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': o.contentType,
        },
        credentials: 'same-origin',
        body: o.data
    });
    return response.json();
}