import {API_URL} from "../config";

const getClient = (options: any = {}): RequestInit  => {

    const headers = {
        'Content-Type': "application/json",
        ...options.headers, // opcionális fejlécek hozzáadása
    };

    if(options.accessToken){
        headers['Authorization'] = `Bearer ${options.accessToken}`;
    }

    return {
        method: options.method,
        headers: headers,
        body: options.body,
        redirect: "follow"
    };
};

export const RequestInitFactory = {

    doRequest : async (endpoint: string, requestOptions: any = {}) => {
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, getClient(requestOptions));
        return await response.json();
    }
}

