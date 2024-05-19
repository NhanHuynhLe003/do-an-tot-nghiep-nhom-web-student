import React from "react";
export default function CardNote({title = "Title", content = "content"}){
    return(
        <div style={{
            display:"flex",
            flexDirection:"column",
            width:"250px",
            borderRadius:"10px",
            flexWrap:"wrap",
            padding:"0,5rem 1rem",
            border:"1px solid black"
           }}>
            <h4 >{title}</h4>
            <p style={{margin: "0px"}}>{content}</p>
           </div>
    );

}
