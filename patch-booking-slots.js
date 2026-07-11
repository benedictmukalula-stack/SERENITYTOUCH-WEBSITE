const fs = require("fs");

const file = "src/app/api/booking/route.ts";

let code = fs.readFileSync(file,"utf8");

if(code.includes("BookingSlot")){
 console.log("Already patched");
 process.exit();
}


// Add overlap check after imports
code = code.replace(
"export async function POST",
`
async function checkSlotConflict(
  therapistId:string,
  date:string,
  time:string
){

  const existing = await db.bookingSlot.findFirst({
    where:{
      therapistId,
      startTime:{
        lt:new Date(\`\${date}T23:59:59\`)
      },
      endTime:{
        gt:new Date(\`\${date}T00:00:00\`)
      }
    }
  });

  return !!existing;
}


export async function POST`
);


// Add slot creation before response success
code = code.replace(
"return Response.json({",
`
if(booking.therapistId){

  const start = new Date(
    \`\${booking.date}T\${booking.time.replace(" AM","").replace(" PM","")}:00\`
  );

  const end = new Date(
    start.getTime() + 60*60*1000
  );


  await db.bookingSlot.create({
    data:{
      bookingId: booking.id,
      therapistId: booking.therapistId,
      startTime:start,
      endTime:end,
      status:"BOOKED"
    }
  });

}


return Response.json({`
);


fs.writeFileSync(file,code);

console.log("✅ BookingSlot integration added");
