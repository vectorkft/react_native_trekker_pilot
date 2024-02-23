import {RequestinitFactory} from "../factory/requestinit-factory";
import {useStore} from "../states/states";
import {Articleresults} from "../interfaces/article-results";

export const ArticlesService = () => {
    const {results, setResults} = useStore.getState();

    const getArticlesByEAN = async  (ean: number) => {
        const options = {
            method: 'POST',
            body: JSON.stringify({
                "eankod": ean
            }),
        }
        try {
            const response= await RequestinitFactory.doRequest('/getCikkByEAN', options);
            if(response.status === 200){
                setResults(true);
                const articleResults: Articleresults = {
                    cikkszam: response.cikkszam,
                    cikknev: response.cikknev,
                    eankod: response.eankod
                };
                return articleResults;
            } else if(response.status === 404){
                setResults(false);
                return response;
            }else {
                return response;
            }

        } catch (e) {
            return e;
        }

    }
    return {
        getArticlesByEAN
    }


}