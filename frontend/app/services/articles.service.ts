import {RequestinitFactory} from "../factory/requestinit-factory";
import {useStore} from "../states/states";
import {ArticleDTOOutput, ZArticleDTOOutput,zParse} from "C:/fejlesztes/react_native_trekker_pilot/shared/dto/article.dto";

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
                const body :ZArticleDTOOutput =await zParse(ArticleDTOOutput,response);
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