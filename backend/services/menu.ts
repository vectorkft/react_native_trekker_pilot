import menu from '../menu/menu.json';
import {MenuData, MenuListOutput, ZMenuInput} from "../../shared/dto/menu";
import {MenuElement} from "../interface/menu";

export async function getMenuElement(input: ZMenuInput ){
    const data=menu.data.find(item => item.id === input.id);
    if (!data) {
        throw new Error(`MENU_NOT_FOUND: The menu with id ${input.id} not found.`);
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
        info: "Menu data loaded",
    }
    return MenuListOutput.parse(result);

}