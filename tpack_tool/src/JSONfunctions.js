
//Item, NPC, and Projectile
export default function infoToJSON(item, propDataArr){
    const changes = {};
    changes[item.source] = {};
    propDataArr.forEach(change => {
        const { property, operation, value } = change;
        changes[item.source][property] = `${operation}${value}`;
    });

    const jsonObject = {
        Item: `${item.source}/${item.name}`,
        Changes: changes
    }

    return JSON.stringify(jsonObject);
}

//Recipe
//function recipeToJson(itemData, propData){}