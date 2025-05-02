

export function addProperties(index, properties, setProperties) {
    const newProperties = [...properties];
    newProperties[index] = [...newProperties[index], {property: "Damage", operation: "+", value: 0}];
    setProperties(newProperties);
}

export function deleteProperties(propKey, index, properties, setProperties) {
    const newProperties = [...properties];
    newProperties[index].splice(propKey, 1);
    setProperties(newProperties);
}

export function changeProperty(propKey, index, properties, setProperties, property, operation, value) {
    console.log(properties);
    const newProperties = [...properties];
    newProperties[index][propKey] = {property: property, operation: operation, value: value};
    setProperties(newProperties);
}

export function changeItemList(index, itemList, setItemList, itemSource, itemName){
    const newItemList = [...itemList];
    newItemList[index] = {source: itemSource, name: itemName, component: "Item"};
    setItemList(newItemList);
}