
function displayOpenOrClose(pos, openIndex, setOpenIndex){
    if(pos === openIndex) {
        return( <p onClick={() => setOpenIndex(null)}>close</p> )
    } else {
        return( <p onClick={() => setOpenIndex(pos)}>open</p> )
    }
}

export default function Populate({pos, openIndex, setOpenIndex, itemList, setItemList, properties, setProperties}){
    
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

    function handleClick(e){
        const newItemList = [...itemList];
        const newProperties = [...properties];

        newItemList.splice(pos, 1);
        newProperties.splice(pos, 1);
        //looks and feels inefficient, but needed for React to rerender
        setItemList(newItemList);
        setProperties(newProperties);
        
        if(pos === openIndex){
            setOpenIndex(null);
        } else if (pos < openIndex) {
            setOpenIndex(openIndex - 1);
        }
    }

    return(
        <div className="ListItem">
            {IsRecipeHandler()}
            <div className="OpenAndClose">
                {displayOpenOrClose(pos, openIndex, setOpenIndex)}
                <img src="/images/trash.png" alt="Delete Icon" width="25" height="25" className="Trash"
                    onClick={() => handleClick()}/>
            </div>
        </div>
    )
}