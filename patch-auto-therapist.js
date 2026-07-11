const fs=require("fs");

const file="src/app/api/booking/route.ts";

let code=fs.readFileSync(file,"utf8");


if(code.includes("autoAssignTherapist")){
 console.log("Already patched");
 process.exit();
}


const insert=`

async function autoAssignTherapist(){

 const therapist = await db.therapist.findFirst({
   where:{
    active:true
   },
   orderBy:{
    sortOrder:"asc"
   }
 });

 return therapist?.id || null;
}

`;

code=code.replace(
"export async function POST",
insert+
"\\nexport async function POST"
);


code=code.replace(
"therapistId:",
"therapistId:"
);


fs.writeFileSync(file,code);

console.log("✅ Auto therapist helper added");

