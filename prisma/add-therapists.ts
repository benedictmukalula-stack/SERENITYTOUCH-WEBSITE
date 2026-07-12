import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(){

await prisma.therapist.createMany({
data:[
{
name:"Taonga Phiri",
specialty:"Massage Therapist",
bio:"Specialist in Swedish, Deep Tissue and Relaxation Massage.",
sortOrder:1
},
{
name:"Grace Phiri",
specialty:"Massage Therapist",
bio:"Specialist in Foot Massage, Reflexology and Pregnancy Massage.",
sortOrder:2
},
{
name:"Patricia Banda",
specialty:"Massage Therapist",
bio:"Specialist in Thai Massage and Therapeutic Treatments.",
sortOrder:3
},
{
name:"Chipo Mulenga",
specialty:"Senior Therapist",
bio:"Specialist in Couples and Full Body Massage.",
sortOrder:4
}
]
});

console.log("Therapists added");

}

main()
.then(()=>prisma.$disconnect())
.catch(async(e)=>{
console.error(e);
await prisma.$disconnect();
process.exit(1);
});

