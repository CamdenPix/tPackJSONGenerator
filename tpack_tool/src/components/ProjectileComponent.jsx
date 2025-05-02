import '../styles/operations.css';
import { addProperties,
    deleteProperties,
    changeProperty,
    changeItemList } 
    from "./setUseStateHelper.js";
/**
 * index is the index place in list
 * status is whether calamity is active or not
 * propData is the data
 * onChange is the function called when data is changed
 */
function Property({propKey, index, calamityStatus, properties, setProperties, propData}){
    const {property, operation, value} = propData;

    function handleChange(e){
        const {name, value: val} = e.target;
        changeProperty(
            propKey,
            index,
            properties,
            setProperties,
            name === "property" ? val : property,
            name === "operation" ? val : operation,
            name === "value" ? (isNaN(parseInt(val)) ? 0 : parseInt(val)) : value
        );
    }

    return(
        <div className="items">
            <label>
            <select name="property" value={property} onChange={handleChange}>
                <option value="Damage">Damage</option>
                <option value="Piercing">Piercing</option>
                <option value="Scale">Scale</option>
                <option value="HitCooldown">HitCooldown</option>
            </select>
            &emsp;
            <select name="operation" value={operation} onChange={handleChange}>
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="x">*</option>
                <option value="">set to</option>
            </select>
            &emsp;
            <input type="number" name="value" value={value} onChange={handleChange}/>
            <button>Delete</button>
            </label>
        </div>
    );
}

/* 
 * properties is the list of items
 * setProperties is how to set those items 
 * */
export default function ProjectileComponent({index, properties, setProperties, itemList, setItemList}) {    

    function handleItemChange(e){
        const {name, value} = e.target;
        changeItemList(
            index,
            itemList,
            setItemList,
            name === "source" ? value : itemList[index].source,
            name === "itemName" ? value : itemList[index].name
        );
    }

    const rows = [];
    for(let i = 0; i < properties[index].length; i++){
        rows.push(<Property 
            key={i}
            propKey={i} 
            index={index}
            properties={properties}
            setProperties={setProperties}
            propData={properties[index][i]}/>);
    }

    return(
    <div>
        <div className="items">
            <label>
            Source/Mod: <input type="text" name="source" onChange={handleItemChange} defaultValue={itemList[index].source}/>
            &emsp;
            Item Name: <input type="text" name="itemName" onChange={handleItemChange} defaultValue={itemList[index].name}/>
            </label>
        </div>
        <h3 className="items">Property&emsp;Operations&emsp;Value</h3>
        {rows}
        <div className="bottomButton">
            <button onClick={()=>addProperties(index, properties, setProperties)}>Add Property</button>
        </div>
    </div>
    );
}