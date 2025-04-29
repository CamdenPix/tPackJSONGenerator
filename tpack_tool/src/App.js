import './styles/App.css';
import { useState } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import ItemChange from './components/ItemComponent.jsx';
import ProjectileChange from './components/ProjectileComponent.jsx';
import NPCChange from './components/NPCComponent.jsx';
import RecipeChange from './components/RecipeComponent.jsx';
import toJSON from './JSONfunctions.js';



function App() {
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
        setProperties_([...properties_, [{property: "Damage", operation: "+", value: 0}]]);
        if(componentType === "Recipe"){
            setItemList([...itemList, {component: componentType, 
                conditions:[{target: "Result", source: "Terraria", item: "Zenith", number: 1}]}]);
        }else{
            setItemList([...itemList, {source: "Terraria", name:defaultValue, component: componentType}]);
        }
        setOpenIndex(properties_.length);
    }

    function closeOpenIndex(){
        setOpenIndex(null); 
    }

    function openChange(i){
        setOpenIndex(i);
    }

    function displayOpenOrClose(pos){
        if(pos === openIndex){
            return(
                <p onClick={closeOpenIndex}>close</p>
            )
        }
        else{
            return(
                <p onClick={() => openChange(pos)}>open</p>
            )
        }
    }

    function Populate({pos}){
        
        function IsRecipeHandler(){
            if(itemList[pos].component==="Recipe"){
                return(
                    <h3>{itemList[pos].conditions[0].item} {itemList[pos].component} Change</h3>
                )
            }else{
                return(
                    <h3>{itemList[pos].name} {itemList[pos].component} Change</h3>
                )
            }
        }

        return(
            <div className="ListItem">
                {IsRecipeHandler()}
                <div className="OpenAndClose">
                    {displayOpenOrClose(pos)}
                </div>
            </div>
        )
    }

    const changes = [];
    for(let i = 0; i < properties_.length; i++){
        changes.push(<Populate pos={i} key={i} />);
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

    function download(){
        const files = [];
        for(let i = 0; i < itemList.length; i++){
            files.push(toJSON(itemList[i], properties_[i]));
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
            <button className="StickyButton" onClick={() => download()}>Export</button>
        </div>
    );
}

export default App;
