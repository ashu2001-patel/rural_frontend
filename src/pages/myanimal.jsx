import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { animalAPI } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MediaViewer from "../components/MediaViewer";
import HighlightPost from "../components/Highlightpost";

const MyAnimals = () => {

const [animals,setAnimals]=useState([]);
const [loading,setLoading]=useState(true);
const [deletingId,setDeletingId]=useState(null);
const [refreshing,setRefreshing]=useState(false);

const { user } = useAuth();
const navigate=useNavigate();


const fetchMyAnimals = useCallback(async()=>{

 try{
   setLoading(true);

   const res = await animalAPI.get("/animal/my");

   setAnimals(res?.data?.animals || []);
 }
 catch(err){
   console.error(
      "Fetch failed",
      err?.response?.data || err.message
   );

   setAnimals([]);

   if(err?.response?.status===401){
      navigate("/login");
   }
 }
 finally{
   setLoading(false);
   setRefreshing(false);
 }

},[navigate]);


useEffect(()=>{

 if(!user){
   navigate("/login");
   return;
 }

 fetchMyAnimals();

},[user,navigate,fetchMyAnimals]);


const handleRefresh = async()=>{
 setRefreshing(true);
 await fetchMyAnimals();
};


const handleDelete = async(id)=>{

const ok=window.confirm(
 "Are you sure you want to delete this animal?"
);

if(!ok) return;

try{

 setDeletingId(id);

 await animalAPI.delete(`/animal/${id}`);

 setAnimals(prev =>
   prev.filter(a=>a._id!==id)
 );

}
catch(err){
 alert("Delete failed");
}
finally{
 setDeletingId(null);
}

};


const totalValue = animals.reduce(
 (sum,a)=>sum+Number(a.price||0),0
);

const availableCount =
 animals.filter(a=>a.status!=="sold").length;



return(
<>
<style>{`
/* your same styles can remain unchanged */
.ma-page{
min-height:100vh;
background:#0f0a05;
padding:1.25rem;
color:#f0e6d0;
}

.ma-shell{
max-width:1200px;
margin:auto;
}

.ma-grid{
display:grid;
grid-template-columns:
repeat(auto-fill,minmax(320px,1fr));
gap:20px;
}

.ma-card{
background:rgba(22,14,8,.92);
border:1px solid rgba(212,175,99,.12);
border-radius:14px;
overflow:hidden;
}

.ma-body{
padding:16px;
}

.ma-name{
font-size:22px;
margin-bottom:8px;
}

.ma-price{
color:#d4af63;
font-weight:700;
margin:10px 0;
}

.ma-meta{
opacity:.8;
margin:6px 0;
}

.ma-date{
font-size:13px;
opacity:.6;
margin-top:8px;
}

.ma-badge{
padding:4px 10px;
border-radius:999px;
}

.sold{
background:rgba(74,107,58,.2);
}

.ma-actions{
display:flex;
gap:8px;
margin-top:12px;
}

.ma-btn-view,
.ma-btn-delete,
.ma-btn-sold{
padding:10px;
border-radius:8px;
cursor:pointer;
border:none;
}

.ma-btn-view{
flex:1;
}

.ma-btn-delete{
flex:1;
}

.ma-btn-sold{
width:100%;
margin-top:12px;
}

.ma-btn{
padding:10px 14px;
border-radius:8px;
cursor:pointer;
}

.ma-btn--gold{
background:linear-gradient(
135deg,#d4af63,#8b5a2b
);
}

.ma-loading,
.ma-empty{
text-align:center;
padding:100px 20px;
}
`}</style>


<div className="ma-page">
<div className="ma-shell">

<div style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"30px",
flexWrap:"wrap",
gap:"12px"
}}>

<div>
<h2>🐄 My Animals</h2>
<p>Manage your livestock listings</p>
</div>

<div style={{
display:"flex",
gap:"10px"
}}>
<button
className="ma-btn"
onClick={handleRefresh}
>
{refreshing ? "Refreshing..." : "↻ Refresh"}
</button>

<button
className="ma-btn ma-btn--gold"
onClick={()=>navigate("/post-animal")}
>
＋ Post Animal
</button>
</div>

</div>


<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"12px",
marginBottom:"25px"
}}>

<div>
<h4>Total Listings</h4>
<h2>{animals.length}</h2>
</div>

<div>
<h4>Available</h4>
<h2>{availableCount}</h2>
</div>

<div>
<h4>Estimated Value</h4>
<h2>₹{totalValue.toLocaleString()}</h2>
</div>

</div>



{loading ? (

<div className="ma-loading">
Loading your animals...
</div>

):animals.length===0 ? (

<div className="ma-empty">
<h3>No animals posted yet</h3>

<button
className="ma-btn ma-btn--gold"
onClick={()=>navigate("/post-animal")}
>
Post Animal
</button>

</div>

):(

<div className="ma-grid">

{animals.map((animal)=>(

<div
key={animal._id}
className="ma-card"
>

<div className="ma-media-wrap">
<MediaViewer
images={animal.images||[]}
videos={animal.videos||[]}
/>
</div>

<div className="ma-body">

<div style={{
display:"flex",
justifyContent:"space-between"
}}>
<h3 className="ma-name">
{animal.name}
</h3>

<span className={`ma-badge ${
animal.status==="sold"
? "sold"
:""
}`}>
{animal.status==="sold"
?"Sold"
:"Available"}
</span>
</div>


<p className="ma-price">
₹{Number(
animal.price||0
).toLocaleString()}
</p>

<p className="ma-meta">
📍 {animal.location}
</p>

<p className="ma-meta">
📞 {animal.contact}
</p>

<p className="ma-date">
Posted:
{" "}
{animal.createdAt
? new Date(
animal.createdAt
).toLocaleDateString()
:"N/A"}
</p>


<button
className="ma-btn-sold"
onClick={()=>navigate("/requests")}
>
📥 View Requests
</button>


{/* HIGHLIGHT BUTTON ADDED HERE */}
<div style={{marginTop:"12px"}}>
<HighlightPost
animalId={animal._id}
isHighlighted={animal.isHighlighted}
onSuccess={fetchMyAnimals}
/>
</div>


<div className="ma-actions">

<button
className="ma-btn-view"
onClick={()=>
navigate(`/animal/${animal._id}`)
}
>
👁 View
</button>


<button
className="ma-btn-delete"
disabled={
deletingId===animal._id
}
onClick={()=>
handleDelete(animal._id)
}
>
{deletingId===animal._id
?"Deleting..."
:"🗑 Delete"}
</button>

</div>

</div>

</div>

))}

</div>

)}

</div>
</div>

</>
);

};

export default MyAnimals;