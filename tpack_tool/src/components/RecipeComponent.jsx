import '../styles/operations.css';

/**
 * index is the index place in list
 * conditionData is an object with the data
 * onChange is the function called to mutate the useState
 */
function Condition({index, conditionData, onChange, deleteElement}){
    const { target, source, item, number } = conditionData;

    function handleChange(e){
        const {name, value} = e.target;
        onChange({
            key: index,
            target_: name === "target" ? value : target,
            source_: name === "source" ? value : source,
            item_: name === "item" ? value : item,
            value_: name === "value" ? (isNaN(parseInt(value)) ? 0 : parseInt(value)) : number
        });
    }

    return(
        <div className="items">
            <label>
            <select name="target" value={target} onChange={handleChange}>
                <option value="Result">Result</option>
                <option value="Ingredient">Ingredient</option>
                <option value="Group">Group</option>
                <option value="Tile">Tile</option>
            </select>
            <input type="text" name="source" value={source} onChange={handleChange}/>
            <input type="text" name="item" value={item} onChange={handleChange}/>
            <input type="number" name="value" value={number} onChange={handleChange}/>
            <button onClick={()=>deleteElement({key:index})}>Delete</button>
            </label>
        </div>
    )
}



/**
 * index is the index place in list
 * propData is an object with the data
 * onChange is the function called to mutate the useState
 */
function Property({index, propData, onChange, deleteElement}){
    const { operation, target, source, item, source2, item2, value } = propData;

    function handleChange(e){
        const {name, value: val} = e.target;
        onChange({
            key: index,
            operation_: name === "operation" ? val : operation,
            target_: name === "target" ? val : target,
            source_: name === "source" ? val : source,
            item_: name === "item" ? val : item,
            source2_: name === "source2" ? val : source2,
            item2_: name === "item2" ? val : item2,
            value_: name === "value" ? (isNaN(parseInt(val)) ? 0 : parseInt(val)) : value
        });
    }

    return(
        <div className="items">
            <label>
            <select name="operation" value={operation} onChange={handleChange}>
                <option value="Add">Add</option>
                <option value="Remove">Remove</option>
                <option value="Change">Change</option>
            </select>
            <select name="target" value={target} onChange={handleChange}>
                <option value="Ingredient">Ingredient</option>
                <option value="RecipeGroup">Group</option>
                <option value="Tile">Tile</option>
                {operation === "Change" && <option value="Result">Result</option>}
            </select>
            <input type="text" name="source" value={source} onChange={handleChange}/>
            <input type="text" name="item" value={item} onChange={handleChange}/>
            {operation === "Change" &&(
                <>
                <input type="text" name="source2" value={source2} onChange={handleChange}/>
                <input type="text" name="item2" value={item2} onChange={handleChange}/>
                </>
            )}
            <input type="number" name="value" value={value} onChange={handleChange}/>
            <button onClick={()=>deleteElement({key:index})}>Delete</button>
            </label>
        </div>
    );
}


export default function RecipeComponent({status, index, properties, setProperties, itemList, setItemList}) {    

    function addProperties() {
        const updateArray = [...properties];
        updateArray[index] = [...updateArray[index], {
            operation: "Add", 
            target: "Ingredient", 
            source: "Terraria",
            item:"Slime", 
            value: 0
        }];
        setProperties(updateArray);
    }

    function changeNormalProperty({key, operation_, target_, source_, item_, value_}) {
        const updateArray = [...properties];
        updateArray[index][key] = {
            operation: operation_, 
            target: target_, 
            source: source_, 
            item: item_, 
            value: value_
        };
        setProperties(updateArray);
    }

    function changeModificationProperty({key, operation_, target_, source_, item_, source2_, item2_, value_}) {
        const nextProperties = [...properties];
        nextProperties[index][key] = {
            operation: operation_, 
            target: target_, 
            source: source_, 
            item: item_, 
            source2: source2_, 
            item2: item2_, 
            value: value_
        };
        setProperties(nextProperties);
    }

    function changeProperty({key, operation_, target_, source_, item_, source2_, item2_, value_}){
        if(operation_ === "Change"){
            changeModificationProperty({key, operation_, target_, source_, item_, source2_, item2_, value_})
        } else{
            changeNormalProperty({key, operation_, target_, source_, item_, value_})
        }
    }
    
    function deleteProperty({key}){
        const newProperties = [...properties];
        newProperties[index].splice(key, 1);
        setProperties(newProperties);
    }

    function addConditions() {
        const updateArray = [...itemList];
        let updateConditions = itemList[index].conditions;
        updateConditions = [...updateConditions, {
            target: "Result", 
            source: "Terraria", 
            item:"Zenith", 
            value: 1
        }];
        updateArray[index].conditions = updateConditions;
        setItemList(updateArray);
    }

    function changeConditions({key, target_, source_, item_, value_}){
        const updateArray = [...itemList];
        updateArray[index].conditions[key] = {
            target: target_,
            source: source_,
            item: item_,
            value: value_
        };
        setItemList(updateArray);
    }

    function deleteCondition({key}){
        const newConditions = [...itemList];
        newConditions[index].conditions.splice(key, 1);
        setItemList(newConditions);
    }
    
    const conditionRows = [];
    for(let i = 0; i < itemList[index].conditions.length; i++){
        conditionRows.push(<Condition 
            key={i} index={i} 
            conditionData={itemList[index].conditions[i]} 
            onChange={changeConditions}
            deleteElement={deleteCondition}/>)
    }

    const propRows = [];
    for(let i = 0; i < properties[index].length; i++){
        propRows.push(<Property 
            key={i} index={i} 
            propData={properties[index][i]} 
            onChange={changeProperty}
            deleteElement={deleteProperty}/>);
    }

    return(
    <div>
        <div className="items">
            {conditionRows}
            <div className="bottomButton">
                <button onClick={addConditions}>Add Condition</button>
            </div>
        </div>
        <h3 className="items">Operation Target Source Item Amount</h3>
        {propRows}
        <div className="bottomButton">
            <button onClick={addProperties}>Add Property</button>
        </div>
    </div>
    );
}