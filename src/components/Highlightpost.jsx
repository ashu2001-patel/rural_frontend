import { useState } from "react";
import { usePayment } from "../hooks/usepayment";
import { useAuth } from "../context/AuthContext";

const HighlightPost = ({
 animalId,
 isHighlighted,
 onSuccess
}) => {

const [loading,setLoading]=useState(false);

const {
 pricing = {
   highlight_post:49
 },
 initiatePayment
} = usePayment() || {};

const { user } = useAuth();


const highlightPrice =
 pricing?.highlight_post ?? 49;


/* Already highlighted */
if(isHighlighted){
return(
<div style={styles.highlighted}>
⭐ Post is Highlighted
</div>
);
}


/* Optional hide if free disabled */
if(highlightPrice===0){
return null;
}



const handleHighlight = async()=>{

if(!user){
 alert("Please login first");
 return;
}

setLoading(true);

try{

await initiatePayment?.(
 "highlight_post",
 animalId,
 ()=>{
   onSuccess?.();
 }
);

}catch(err){
 console.error(
   "Highlight payment failed",
   err
 );
 alert("Payment failed");
}
finally{
 setLoading(false);
}

};



return(
<button
onClick={handleHighlight}
disabled={loading}
style={styles.button}
>

{loading
? "Processing..."
: `⭐ Highlight Post — ₹${highlightPrice}`
}

</button>
);

};



const styles={

button:{
width:"100%",
padding:"10px",
background:"rgba(212,175,99,.08)",
border:"1px solid rgba(212,175,99,.25)",
borderRadius:"8px",
color:"#d4af63",
fontSize:"14px",
cursor:"pointer"
},

highlighted:{
padding:"8px 14px",
background:"rgba(212,175,99,.1)",
border:"1px solid rgba(212,175,99,.25)",
borderRadius:"8px",
fontSize:"13px",
color:"#d4af63",
textAlign:"center"
}

};

export default HighlightPost;