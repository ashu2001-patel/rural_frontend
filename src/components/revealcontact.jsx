import { useState, useEffect } from "react";
import { usePayment } from "../hooks/usepayment";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RevealContact = ({ contact, animalId }) => {

const [revealed,setRevealed]=useState(false);
const [loading,setLoading]=useState(false);

const {
 pricing = { reveal_contact:0 },
 initiatePayment,
 checkAccess
} = usePayment() || {};

const { user } = useAuth();
const navigate=useNavigate();


useEffect(()=>{

if(user && animalId){
 checkIfRevealed();
}

},[user,animalId]);


const checkIfRevealed = async()=>{

try{
 const hasAccess=await checkAccess?.(
   "reveal_contact",
   animalId
 );

 if(hasAccess){
   setRevealed(true);
 }

}catch(err){
 console.error(
  "Access check failed",
  err
 );
}

};



const handleReveal = async()=>{

if(!user){
 navigate("/login");
 return;
}

setLoading(true);

try{

await initiatePayment?.(
 "reveal_contact",
 animalId,
 ()=>{
   setRevealed(true);
 }
);

}catch(err){

console.error(err);
alert("Payment failed");

}
finally{
setLoading(false);
}

};



if(revealed){

return(
<div style={s.revealed}>

<span style={s.revealedLabel}>
📞 Contact
</span>

<a
href={`tel:${contact}`}
style={s.contactNum}
>
{contact || "No Contact"}
</a>

<a
href={`https://wa.me/${
contact?.replace(/\D/g,"") || ""
}`}
target="_blank"
rel="noreferrer"
style={s.waBtn}
>
💬 WhatsApp
</a>

</div>
);

}



const revealPrice=
pricing?.reveal_contact ?? 0;


return(
<div style={s.wrap}>

<div style={s.blurred}>
📞 +91 ••••• •••••
</div>


<button
style={s.revealBtn}
onClick={handleReveal}
disabled={loading}
>
{loading
? "Processing..."
: revealPrice===0
? "📞 Reveal Contact (Free)"
: `📞 Reveal Contact — ₹${revealPrice}`
}
</button>


{revealPrice>0 &&(
<p style={s.hint}>
One-time payment to view seller contact
</p>
)}

</div>
);

};



const s = {

wrap:{
marginTop:"1rem"
},

blurred:{
padding:"10px 14px",
background:"rgba(255,255,255,.03)",
border:"1px solid rgba(212,175,99,.1)",
borderRadius:"8px",
color:"rgba(240,230,208,.25)",
letterSpacing:".1em",
marginBottom:"8px",
filter:"blur(4px)",
userSelect:"none"
},

revealBtn:{
width:"100%",
padding:"12px",
background:
"linear-gradient(135deg,#d4af63,#8b5a2b)",
border:"none",
borderRadius:"10px",
fontWeight:600,
cursor:"pointer"
},

hint:{
textAlign:"center",
marginTop:"6px",
fontSize:"12px"
},

revealed:{
display:"flex",
flexDirection:"column",
gap:"8px",
padding:"12px",
background:"rgba(74,107,58,.1)",
borderRadius:"10px"
},

revealedLabel:{
fontSize:"12px"
},

contactNum:{
fontSize:"18px",
textDecoration:"none"
},

waBtn:{
padding:"8px",
textAlign:"center",
borderRadius:"7px",
textDecoration:"none"
}

};

export default RevealContact;