import '../styles/operations.css';

/**
 * index is the index place in list
 * status is whether calamity is active or not
 * propData is the data
 * onChange is the function called when data is changed
 */
function Property({index, calamityStatus, propData, onChange}){
    const {property, operation, value} = propData;

    function handleChange(e){
        const {name, value: val} = e.target;
        onChange({
            key: index,
            property_: name === "property" ? val : property,
            operation_: name === "operation" ? val : operation,
            value_: name === "value" ? (isNaN(parseInt(val)) ? 0 : parseInt(val)) : value
        });
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
    //const [properties, setProperties] = useState([]);

    function addProperties() {
        const updateArray = [...properties];
        updateArray[index] = [...updateArray[index], {property: "Damage", operation: "+", value: 0}];
        setProperties(updateArray);
    }

    function changeProperty({key, property_, operation_, value_}) {
        const nextProperties = [...properties];
        nextProperties[index][key] = {property: property_, operation: operation_, value:value_};
        setProperties(nextProperties);
    }

    function changeItemList({itemSource, itemName}){
        const updateArray = [...itemList];
        updateArray[index] = {source: itemSource, name: itemName, component: "Projectile"};
        setItemList(updateArray);
    }

    function handleItemChange(e){
        const {name, value} = e.target;
        changeItemList({
            itemSource: name === "source" ? value : itemList[index].source,
            itemName: name === "itemName" ? value : itemList[index].name
        });
    }

    const rows = [];
    for(let i = 0; i < properties[index].length; i++){
        rows.push(<Property key={i} index={i} propData={properties[index][i]} onChange={changeProperty} />);
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
            <button onClick={addProperties}>Add Property</button>
        </div>
    </div>
    );
}