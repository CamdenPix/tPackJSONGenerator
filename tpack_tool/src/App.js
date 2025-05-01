import './styles/App.css';
import { useState } from 'react';
import ItemChange from './components/ItemComponent.jsx';
import ProjectileChange from './components/ProjectileComponent.jsx';
import NPCChange from './components/NPCComponent.jsx';
import RecipeChange from './components/RecipeComponent.jsx';
import Populate from './components/ChangeList.jsx';
import Download from './JSONfunctions.js';


export default function App() {
    const [openIndex, setOpenIndex] = useState(null);
    const [properties_, setProperties_] = useState([]);
    const [itemList, setItemList] =  useState([]);
    const [componentType, setComponentType] = useState("Item");

    function addChange(componentType){
        let defaultValue;
        switch (componentType) {
            case "Item":
                defaultValue = "TerraBlade";
                break;
            case "Projectile":
                defaultValue = "WoodenArrowFriendly";
                break;
            case "NPC":
                defaultValue = "BlueSlime";
                break;
            //case "Recipe" handled with if/else statement, due to needing different data structure
            default:
                defaultValue = "ERROR"
                break;
        }
        
        if(componentType === "Recipe"){
            setItemList([...itemList, {component: componentType, conditions:[{
                target: "Result", 
                source: "Terraria", 
                item: "Zenith", 
                number: 1
            }]}]);
            setProperties_([...properties_, [{
                operation: "Add", 
                target: "Ingredient", 
                source: "Terraria", 
                item: "Slime", 
                value: 0
            }]]);
        } else {
            setItemList([...itemList, {source: "Terraria", name:defaultValue, component: componentType}]);
            setProperties_([...properties_, [{property: "Damage", operation: "+", value: 0}]]);
        }
        setOpenIndex(properties_.length);
    }

    const changes = [];
    for(let i = 0; i < properties_.length; i++){
        changes.push(<Populate pos={i} key={i} openIndex={openIndex} setOpenIndex={setOpenIndex} itemList={itemList}/>);
        if(i === openIndex){
            switch (itemList[i].component) {
                case "Item":
                    changes.push(<ItemChange 
                        key={`o${i}`} 
                        status={false} 
                        index={i} 
                        properties={properties_} 
                        setProperties={setProperties_}
                        itemList={itemList}
                        setItemList={setItemList}/>);
                break;
            case "Projectile":
                changes.push(<ProjectileChange 
                    key={`o${i}`} 
                    index={i} 
                    properties={properties_} 
                    setProperties={setProperties_}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            case "NPC":
                changes.push(<NPCChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties_} 
                    setProperties={setProperties_}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            case "Recipe":
                changes.push(<RecipeChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties_} 
                    setProperties={setProperties_}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            default:
                changes.push(<ItemChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties_} 
                    setProperties={setProperties_}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            }
            
        }
    }

    function handleChange(e){
        const {value} = e.target;
        setComponentType(value);
    }

    return (
        <div className="App">
            <header className="App-header">
                <p>tPackBuilder JSON File Generator</p>
            </header>
            <div className="ChangesFlexbox">
                {changes}
            </div>
            <div className="Selection">
                <button onClick={() => addChange(componentType)}>Add Change</button>
                <select id="componentType" value={componentType} onChange={handleChange}>
                    <option>Item</option>
                    <option>Projectile</option>
                    <option>NPC</option>
                    <option>Recipe</option>
                </select>
            </div>
            <button className="StickyButton" onClick={() => Download(itemList, properties_)}>Export</button>
        </div>
    );
}