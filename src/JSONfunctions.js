import JSZip from 'jszip';
import FileSaver from 'file-saver';
const CalamityProperties = ["MaxCharge", "ChargePerUse", "ChargePerAltUse", "DamageReduction"];

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

//Object list is the actual list passed in, not with what the component is
function ObjectToJSON(objectList, propDataArr){
    let items = "";
    let modifications = "";

    objectList.forEach(object => {
        items += `\t"Item":"${object.source}/${object.name}",\n`;
    });
    
    const changes = {};
    changes["Terraria"] = [];
    changes["CalamityMod"] = [];
    propDataArr.forEach(change => {
        const { property, operation, value } = change;
        if(CalamityProperties.includes(property)){
            changes["CalamityMod"].push({property, operation, value});
        }
        else{
            changes["Terraria"].push({property, operation, value});
        }
    });

    modifications += ` \t"Changes":{\n\t\t"Terraria":{\n`;
    changes["Terraria"].forEach((change, index) => {
        modifications += `\t\t\t"${change.property}":"${change.operation}${change.value}"`;
        if(index < changes["Terraria"].length-1){
            modifications += ",";
        }
        modifications += "\n";
    });
    modifications += ` \t\t}`
    if(changes["CalamityMod"] !== undefined){
        modifications += `,\n\t\t"CalamityMod":{\n`

        changes["CalamityMod"].forEach((change, index) => {
            modifications += `\t\t\t"${change.property}":"${change.operation}${change.value}"`;
            if(index < changes["CalamityMod"].length-1){
                modifications += ",";
            }
        modifications += "\n";
        });
        modifications += ` \t\t}\n`;
    }
    modifications += "\t}";

    return `{\n${items}\n${modifications}\n}`;
}

//Duplicate keys are needed, so I'll need to generate raw text instead, yayyy
function RecipeToJSON(itemData, propDataArr){
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

function AddRecipeToJSON(itemData, propDataArr){
    let result = "";
    let changes = "";

    result = `"Result:":{"Item": "${itemData.source}/${itemData.name}", "Count": ${itemData.value}},`;
    propDataArr.forEach((change, index) => {
        switch (change.target) {
            case "Ingredient":
                changes += `    "Ingredient": {"Item": "${change.source}/${change.item}", "Count": ${change.value}}`;
                break;
            case "GroupIngredient":
                changes += `    "GroupIngredient": {"Group": "${change.item}", "Count": ${change.value}}`;
                break;
            case "Tile":
                changes += `    "Tile": "${change.source}/${change.item}"`;
                break;
            default:
                break;
        }
        if(index !== (propDataArr.length-1)){
            changes += ",\n";
        }
    });

    return `{
    ${result}
${changes}
}`
}

export default function Download(itemList, properties){
    const files = [];
    for(let i = 0; i < itemList.length; i++){
        if(itemList[i].component === "Recipe"){
            files.push(RecipeToJSON(itemList[i], properties[i]));
        } else if(itemList[i].component === "AddRecipe"){
            files.push(AddRecipeToJSON(itemList[i], properties[i]));
        } else {
            files.push(ObjectToJSON(itemList[i].targetObjects, properties[i]));
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
            case "AddRecipe":
                fileType = "recipebuilder";
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