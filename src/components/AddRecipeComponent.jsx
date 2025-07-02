import '../styles/operations.css';

/**
 * index is the index place in list
 * conditionData is an object with the data
 * onChange is the function called to mutate the useState
 */
function Condition({index, conditionData, onChange}){
    const { source, name, value } = conditionData;

    function handleChange(e){
        const {name: n, value: val} = e.target;
        onChange({
            key: index,
            source_: n === "source" ? val : source,
            name_: n === "item" ? val : name,
            value_: n === "value" ? (isNaN(parseInt(val)) ? 0 : parseInt(val)) : value
        });
    }

    return(
        <div className="items">
            <label>
            <input type="text" name="source" value={source} onChange={handleChange}/>
            <input type="text" name="item" value={name} onChange={handleChange}/>
            <input type="number" name="value" value={value} onChange={handleChange}/>
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
    const { target, source, item, value } = propData;

    function handleChange(e){
        const {name, value: val} = e.target;
        onChange({
            key: index,
            target_: name === "target" ? val : target,
            source_: name === "source" ? val : source,
            item_: name === "item" ? val : item,
            value_: name === "value" ? (isNaN(parseInt(val)) ? 0 : parseInt(val)) : value
        });
    }

    return(
        <div className="items">
            <label>
            <select name="target" value={target} onChange={handleChange}>
                <option value="Ingredient">Ingredient</option>
                <option value="GroupIngredient">Group</option>
                <option value="Tile">Tile</option>
            </select>
            <input type="text" name="source" value={source} onChange={handleChange}/>
            <input type="text" name="item" value={item} onChange={handleChange}/>
            <input type="number" name="value" value={value} onChange={handleChange}/>
            <button onClick={()=>deleteElement({key:index})}>Delete</button>
            </label>
        </div>
    );
}


export default function RecipeComponent({index, properties, setProperties, itemList, setItemList}) {    

    function addProperties() {
        const updateArray = [...properties];
        updateArray[index] = [...updateArray[index], {
            target: "Ingredient", 
            source: "Terraria",
            item:"Slime", 
            value: 0
        }];
        setProperties(updateArray);
    }

    function changeProperty({key, operation_, target_, source_, item_, value_}) {
        const updateArray = [...properties];
        updateArray[index][key] = {
            target: target_, 
            source: source_, 
            item: item_, 
            value: value_
        };
        setProperties(updateArray);
    }
    
    function deleteProperty({key}){
        const newProperties = [...properties];
        newProperties[index].splice(key, 1);
        setProperties(newProperties);
    }

    function changeConditions({key, source_, name_, value_}){
        const updateArray = [...itemList];
        updateArray[index] = {
            component: updateArray[index].component,
            source: source_,
            name: name_,
            value: value_
        };
        setItemList(updateArray);
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
            <Condition conditionData={itemList[index]} onChange={changeConditions}/>
        </div>
        <h3 className="items">
            <span className="label">Target</span>
            <span className="label">Source</span>
            <span className="label">Item</span>
            <span className="label">Amount</span>
        </h3>
        {propRows}
        <div className="bottomButton">
            <button onClick={addProperties}>Add Property</button>
        </div>
    </div>
    );
}