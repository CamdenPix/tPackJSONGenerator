import './styles/App.css';
import { useState } from 'react';
import ItemChange from './components/ItemComponent.jsx';
import ProjectileChange from './components/ProjectileComponent.jsx';
import NPCChange from './components/NPCComponent.jsx';
import RecipeChange from './components/RecipeComponent.jsx';
import AddRecipe from './components/AddRecipeComponent.jsx';
import Populate from './components/ChangeList.jsx';
import Download from './JSONfunctions.js';


export default function App() {
    const [openIndex, setOpenIndex] = useState(null);
    const [properties, setProperties] = useState([]);
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
            setItemList([...itemList, {component: componentType, criteria:"All", conditions:[{
                target: "Result", 
                source: "Terraria", 
                item: "Zenith", 
                number: 1
            }]}]);
            setProperties([...properties, [{
                operation: "Add", 
                target: "Ingredient", 
                source: "Terraria", 
                item: "Slime", 
                value: 0
            }]]);
        } else if (componentType === "AddRecipe") {
            setItemList([...itemList, {component: componentType, source: "Terraria", name: "Zenith", value: 1}]);
            setProperties([...properties, [{
                target: "Ingredient", 
                source: "Terraria", 
                item: "Slime", 
                value: 1
            }]]);
        } else {
            setItemList([...itemList, {source: "Terraria", name:defaultValue, component: componentType}]);
            setProperties([...properties, [{property: "Damage", operation: "+", value: 0}]]);
        }
        setOpenIndex(properties.length);
    }

    const changes = [];
    for(let i = 0; i < properties.length; i++){
        changes.push(<Populate pos={i} key={i} openIndex={openIndex} 
            setOpenIndex={setOpenIndex} itemList={itemList} setItemList={setItemList}
            properties={properties} setProperties={setProperties}/>);
        if(i === openIndex){
            switch (itemList[i].component) {
                case "Item":
                    changes.push(<ItemChange 
                        key={`o${i}`} 
                        status={false} 
                        index={i} 
                        properties={properties} 
                        setProperties={setProperties}
                        itemList={itemList}
                        setItemList={setItemList}/>);
                break;
            case "Projectile":
                changes.push(<ProjectileChange 
                    key={`o${i}`} 
                    index={i} 
                    properties={properties} 
                    setProperties={setProperties}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            case "NPC":
                changes.push(<NPCChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties} 
                    setProperties={setProperties}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            case "Recipe":
                changes.push(<RecipeChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties} 
                    setProperties={setProperties}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            case "AddRecipe":
                changes.push(<AddRecipe 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties} 
                    setProperties={setProperties}
                    itemList={itemList}
                    setItemList={setItemList}/>);
                break;
            default:
                changes.push(<ItemChange 
                    key={`o${i}`} 
                    status={false} 
                    index={i} 
                    properties={properties} 
                    setProperties={setProperties}
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
                    <option>AddRecipe</option>
                </select>
            </div>
            <button className="StickyButton" onClick={() => Download(itemList, properties)}>Export</button>
        </div>
    );
}