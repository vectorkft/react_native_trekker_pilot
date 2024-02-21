export class RequestInitFactory {
    public readonly baseUrl: string;
    private readonly contentType: string;



    //TODO: default url configból,undefined akkor állítom a configra,konstruktor elmehet, dorequest-fetch minden info átmenne
    constructor(apiUrl: string) {
        this.baseUrl = apiUrl;
        this.contentType = "application/json";
    }

    getClient = (options: any = {}): RequestInit  => {

        const headers = {
            'Content-Type': this.contentType,
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
    }
}

