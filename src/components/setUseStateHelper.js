

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
    const newProperties = [...properties];
    newProperties[index][propKey] = {property: property, operation: operation, value: value};
    setProperties(newProperties);
}

export function addObject(index, objectList, setObjectList, objectSource, objectName){
    const newObjectList = [...objectList];
    const preexistingTargetObjects = [...newObjectList[index].targetObjects];
    preexistingTargetObjects.push({source:objectSource, name:objectName});

    newObjectList[index] = {component: newObjectList[index].component, targetObjects: preexistingTargetObjects};
    setObjectList(newObjectList);
}

export function modifyObject(index, objKey, objectList, setObjectList, objectSource, objectName){
    const newObjectList = [...objectList];
    const preexistingTargetObjects = [...newObjectList[index].targetObjects];
    preexistingTargetObjects[objKey] = {source:objectSource, name:objectName}

    newObjectList[index] = {component: newObjectList[index].component, targetObjects: preexistingTargetObjects};
    setObjectList(newObjectList);
}

export function deleteObject(index, objKey, objectList, setObjectList){
    const newObjectList = [...objectList];
    const preexistingTargetObjects = [...newObjectList[index].targetObjects];
    preexistingTargetObjects.splice(objKey, 1);

    newObjectList[index] = {component: newObjectList[index].component, targetObjects: preexistingTargetObjects};
    setObjectList(newObjectList);
}

export function changeItemList(index, itemList, setItemList, itemSource, itemName){
    const newItemList = [...itemList];
    newItemList[index] = {source: itemSource, name: itemName, component: "Item"};
    setItemList(newItemList);
}