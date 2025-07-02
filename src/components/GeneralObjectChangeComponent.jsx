import '../styles/operations.css';
import { addProperties,
        deleteProperties,
        changeProperty,
        addObject,
        modifyObject,
        deleteObject} 
        from "./setUseStateHelper.js";


function Object({objKey, index, objectList, setObjectList}){
    const {source, name} = objectList[index].targetObjects[objKey];
    //add functionality for change
    function handleChange(e){
        const {name: n, value} = e.target;
        modifyObject(
            index,
            objKey,
            objectList,
            setObjectList,
            n === "source" ? value : source,
            n === "objectName" ? value : name
        )
    }

    return(
        <div className="items">
            <label>
            Source/Mod: <input type="text" name="source" onChange={handleChange} defaultValue={objectList[index].targetObjects[objKey].source}/>
            &emsp;
            {objectList[index].component} Name: <input type="text" name="objectName" onChange={handleChange} defaultValue={objectList[index].targetObjects[objKey].name}/>
            </label>
            {(objKey !== 0) && <button onClick={()=>deleteObject(index, objKey, objectList, setObjectList)}>Delete</button>}
        </div>
    );
}


function Property({propKey, index, calamityStatus, properties, setProperties, objectList}){
    const {property, operation, value} = properties[index][propKey];

    function handleChange(e){
        const {name, value: val} = e.target;
        changeProperty(
            propKey,
            index,
            properties,
            setProperties,
            name === "property" ? val : property,
            name === "operation" ? val : operation,
            name === "value" ? (isNaN(parseFloat(val)) ? 0 : parseFloat(val)) : value
        );
    }

    return(
        <div className="items">
            <label>
            <select name="property" value={property} onChange={handleChange}>
                {<GetObjectStats objectType={objectList[index].component} calamityStatus={calamityStatus}/>}
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
            <button onClick={() => deleteProperties(propKey, index, properties, setProperties)}>Delete</button>
            </label>
        </div>
    );
}

function GetObjectStats({objectType, calamityStatus}){
    console.log(calamityStatus);
    switch (objectType) {
        case "Item":
            return (<>
                <option value="Damage">Damage</option>
                <option value="CritRate">CritRate</option>
                <option value="Defense">Defense</option>
                <option value="HammerPower">HammerPower</option>
                <option value="PickaxePower">PickaxePower</option>
                <option value="AxePower">AxePower</option>
                <option value="Healing">Healing</option>
                <option value="ManaRestoration">ManaRestoration</option>
                <option value="Knockback">Knockback</option>
                <option value="LifeRegen">LifeRegen</option>
                <option value="ManaCost">ManaCost</option>
                <option value="ShootSpeed">ShootSpeed</option>
                <option value="UseTime">UseTime</option>
                <option value="UseAnimation">UseAnimation</option>
                {<CalamityStatusItem calamityStatus={calamityStatus} />}
                </>);
        case "Projectile":
            return (<>
                <option value="Damage">Damage</option>
                <option value="Piercing">Piercing</option>
                <option value="Scale">Scale</option>
                <option value="HitCooldown">HitCooldown</option>
                </>);
        case "NPC":
            return (<>
                <option value="Damage">Damage</option>
                <option value="Defense">Defense</option>
                <option value="Health">Health</option>
                <option value="KnockbackScaling">KnockbackScaling</option>
                <option value="NPCSlots">NPCSlots</option>
                {<CalamityStatusNPC calamityStatus={calamityStatus} />}
                </>);
        default:
            break;
    }
}

function CalamityStatusItem({calamityStatus}){
    return (calamityStatus && 
        <>
            <option value="MaxCharge">MaxCharge</option>
            <option value="ChargePerUse">ChargePerUse</option>
            <option value="ChargePerAltUse">ChargePerAltUse</option>
        </>
    )
};
function CalamityStatusNPC({calamityStatus}){
    return (calamityStatus && 
        <option value="DamageReduction">DamageReduction</option>
    )
};


export default function GeneralObjectChangeComponent({calamityStatus, index, properties, setProperties, objectList, setObjectList}) {    

    const objectsHTML = [];
    for(let i = 0; i < objectList[index].targetObjects.length; i++){
        objectsHTML.push(<Object 
            key={i}
            objKey={i} 
            index={index}
            objectList={objectList}
            setObjectList={setObjectList}/>);
    }

    const propertiesHTML = [];
    for(let i = 0; i < properties[index].length; i++){
        propertiesHTML.push(<Property 
            key={i}
            propKey={i} 
            index={index}
            calamityStatus={calamityStatus}
            properties={properties}
            setProperties={setProperties}
            objectList={objectList}/>);
    }

    return(
    <div>
        <div className="items">
            {objectsHTML}
        </div>
        <div className="bottomButton">
            <button onClick={()=>addObject(index, objectList, setObjectList, "Terraria", "NEW TARGET")}>Add New Target</button>
        </div>
        <h3 className="items">
            <span className="label">Property</span>
            <span className="label">Operations</span>
            <span className="label">Value</span>
        </h3>
        {propertiesHTML}
        <div className="bottomButton">
            <button onClick={()=>addProperties(index, properties, setProperties)}>Add Property</button>
        </div>
    </div>
    );
}