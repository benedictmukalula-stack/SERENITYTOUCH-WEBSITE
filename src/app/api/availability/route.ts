import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function to12Hour(time24:string){

  const [h,m] = time24.split(':').map(Number);

  const period = h >= 12 ? 'PM':'AM';

  const hour = h % 12 || 12;

  return `${hour}:${m.toString().padStart(2,'0')} ${period}`;

}


const therapistRules: Record<string,string[]> = {

  "head-scalp":["Taonga Phiri"],
  "foot-massage":["Grace Phiri"],
  "back-neck-shoulder":["Taonga Phiri"],
  "swedish":["Taonga Phiri"],
  "deep-tissue":["Taonga Phiri"],
  "aromatherapy":["Taonga Phiri","Grace Phiri"],
  "pregnancy":["Grace Phiri"],
  "reflexology":["Grace Phiri","Patricia Banda"],
  "thai":["Patricia Banda"],
  "full-body":["Chipo Mulenga"],
  "couples":["Chipo Mulenga"],
  "four-hands-massage":["Chipo Mulenga"],
  "body-scrub":["Grace Phiri"]

};


export async function OPTIONS(){

 return new NextResponse(null,{
   status:204,
   headers:CORS_HEADERS
 });

}



export async function GET(req:NextRequest){

 try{


 const date =
 req.nextUrl.searchParams.get("date");

 const service =
 req.nextUrl.searchParams.get("service");


 if(!date){

 return NextResponse.json(
 {
 success:false,
 error:"date required"
 },
 {status:400}
 );

 }



 const day =
 new Date(date+"T00:00:00").getDay();


 if(day===0){

 return NextResponse.json({
 success:true,
 availableSlots:[],
 bookedSlots:[],
 closed:true
 });

 }



 let start=9;
 let end=17;


 if(day===6){

 start=10;
 end=16;

 }



 const slots:string[]=[];


 for(let h=start;h<end;h++){

 for(let m of [0,30]){

 slots.push(
 `${h.toString().padStart(2,'0')}:${m}`
 );

 }

 }



 /*
    Find therapists who can do service
 */

 let therapists:any[]=[];


 const names =
 therapistRules[service || ""] || [];


 if(names.length){

 therapists =
 await db.therapist.findMany({

 where:{
 active:true,
 name:{
 in:names
 }
 }

 });

 }
 else {


 therapists =
 await db.therapist.findMany({

 where:{
 active:true
 }

 });


 }



 /*
    Existing bookings
 */

 const bookings =
 await db.booking.findMany({

 where:{
 date,
 status:{
 in:[
 "confirmed",
 "pending_confirmation"
 ]
 }
 },

 select:{
 therapistId:true,
 time:true
 }

 });



 const available:string[]=[];
 const booked:string[]=[];



 for(const slot of slots){


 const occupied =
 therapists.every(t=>{


 return bookings.some(b=>

 b.therapistId===t.id &&
 b.time===slot

 );


 });


 if(occupied){

 booked.push(to12Hour(slot));

 }
 else{

 available.push(to12Hour(slot));

 }


 }



 return NextResponse.json({

 success:true,
 date,
 availableSlots:available,
 bookedSlots:booked,
 closed:false

 },{
 headers:CORS_HEADERS
 });



 }
 catch(error){

 console.error("[availability]",error);


 return NextResponse.json({

 success:false,
 error:"availability failed"

 },{
 status:500
 });


 }


}
