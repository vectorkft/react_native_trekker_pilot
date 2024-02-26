import {RequestinitFactory} from "../factory/requestinit-factory";
import {useStore} from "../states/states";
import {
    ArticleDTOOutput,
    ArticleDTOOutput2,
    ZArticleDTOOutput,
    ZArticleDTOOutput2,
    zParse
} from '../../../shared/dto/article.dto';

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
                const ean= BigInt(response.eankod);
                const body :ZArticleDTOOutput2 =await zParse(ArticleDTOOutput2,response);
                return body;
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