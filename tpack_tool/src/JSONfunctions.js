import JSZip from 'jszip';
import FileSaver from 'file-saver';

//Item, NPC, and Projectile
function ToJSON(item, propDataArr){
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

//Duplicate keys are needed, so I'll need to generate raw text instead, yayyy
function RecipeToJson(itemData, propDataArr){
    let conditions = "";
    let changes = "";

    //generate list of conditions
    itemData.conditions.forEach(condition => {
        switch (condition.target) {
            case "Result":
                conditions += `
            "CreatesResult": {
                "Item": "${condition.source}/${condition.item}",
                "Count": ${condition.number}
            }`;
                break;
            case "Ingredient":
                conditions += `
            "RequiresIngredient": {
                "Item": "${condition.source}/${condition.item}",
                "Count": ${condition.number}
            }`;
                break;
            case "Group":
                conditions += `
            "RequiresRecipeGroup": {
                "Item": "${condition.item}",
                "Count": ${condition.number}
            }`;
                break;
            case "Tile":
                conditions += `
            "RequiresTile": {
                "Item": "${condition.source}/${condition.item}"
            }`;
                break;
            default:
                break;
        }
    });
    //generate list of changes
    propDataArr.forEach((change, index) => {
        //This isn't the simplelest solution, but it is the most readable.
        changes += "\t\t\t"; 
        changes += `"${change.operation}${change.target}": {`;
        switch (change.operation) {
            case "Add":
                switch (change.target) {
                    case "Ingredient":
                        changes += `
                "Item": "${change.source}/${change.item}",
                "Count": "${change.value}"`
                        break;
                    case "RecipeGroup":
                        changes += `
                "Group": "${change.item}",
                "Count": ${change.value}`
                        break;
                    case "Tile":
                        changes += `
                "Tile": "${change.source}/${change.item}"`
                        break;
                    default:
                        break;
                }
                break;
            case "Remove":
                switch (change.target) {
                    case "Ingredient":
                        changes += `
                "Item": "${change.source}/${change.item}"`
                        break;
                    case "RecipeGroup":
                        changes += `
                "Group": "${change.item}"`
                        break;
                    case "Tile":
                        changes += `
                "Tile": "${change.source}/${change.item}"`
                        break;
                    default:
                        break;
                }
                break;
            case "Change":
                switch (change.target) {
                    case "Ingredient":
                        changes += `
                "Item": "${change.source}/${change.item}",
                "NewItem": "${change.source2}/${change.item2}",
                "NewCount": ${change.value}`
                        break;
                    case "RecipeGroup":
                        changes += `
                "Group": "${change.item}",
                "NewGroup": "${change.item}",
                "NewCount": ${change.value}`
                        break;
                    case "Tile":
                        changes += `
                "Tile": "${change.source}/${change.item}",
                "NewTile": "${change.source}/${change.item}"`
                        break;
                    case "Result":
                        changes += `
                "Item": "${change.source}/${change.item}",
                "Count": ${change.value}`
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        if(index < propDataArr.length-1){
            changes += "\n\t\t\t},\n" //so, the last comma will probably throw an error?
        } else {
            changes += "\n\t\t\t}"
        }
    });

    return (`{
        "Conditions":{${conditions}
        },
        "Changes":{
${changes}
        },
        "Criteria": "${itemData.criteria}"
}`);
}

export default function Download(itemList, properties){
    const files = [];
    for(let i = 0; i < itemList.length; i++){
        if(itemList[i].component !== "Recipe") {
            files.push(ToJSON(itemList[i], properties[i]));
        } else {
            files.push(RecipeToJson(itemList[i], properties[i]));
        }
    }

    const zip = new JSZip();
    for(let i = 0; i < itemList.length; i++){
        let fileType = "";
        switch (itemList[i].component) {
            case "Item":
                fileType = "itemmod";
                break;
            case "Projectile":
                fileType = "projectilemod";
                break;
            case "NPC":
                fileType = "npcmod";
                break;
            case "Recipe":
                fileType = "recipemod";
                break;
            default:
                fileType = "ERROR"
                break;
        }
        zip.file(`${itemList[i].component}_${itemList[i].name}.${fileType}.json`, files[i]);
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
        FileSaver.saveAs(content, "download.zip");
    });
}