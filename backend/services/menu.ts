import menu from '../../shared/menu/menu.json';
import {MenuData, MenuListOutput, ZMenuInput} from "../../shared/dto/menu";
import {MenuElement} from "../interface/menu";
import {MenuNotFound} from "../errors/menu-not-found";

export async function getMenuElement(input: ZMenuInput ){
    const data=menu.data.find(item => item.id === input.id);
    if (!data) {
        throw new MenuNotFound(input.id);
    }
    return processMenu([data]);
}

async function processMenu(input: MenuElement[]){
    const result={
        data: input.flatMap((inputElement)=>[
            MenuData.parse({
                id: inputElement.id,
                title: inputElement.title,
                hotkey: inputElement.hotkey,
            }),
        ]),
        count: input.length,
        info: "Valami info",
    }
    return MenuListOutput.parse(result);

}