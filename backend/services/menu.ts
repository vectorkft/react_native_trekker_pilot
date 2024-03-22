import menu from '../menu/menu.json';
import {ZMenuInput} from "../../shared/dto/menu";


export async function getMenuElement(input: ZMenuInput ){
    return menu.data.find(item => item.id === input.id);
}