
function displayOpenOrClose(pos, openIndex, setOpenIndex){
    if(pos === openIndex) {
        return( <p onClick={() => setOpenIndex(null)}>close</p> )
    } else {
        return( <p onClick={() => setOpenIndex(pos)}>open</p> )
    }
}

export default function Populate({pos, openIndex, setOpenIndex, itemList}){
    
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
                {displayOpenOrClose(pos, openIndex, setOpenIndex)}
            </div>
        </div>
    )
}