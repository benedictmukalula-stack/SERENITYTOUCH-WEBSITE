'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import ComparisonTable from '@/components/tinas/ComparisonTable';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i:number) => ({
    opacity:1,
    y:0,
    transition:{
      delay:i * 0.06,
      duration:0.5
    }
  })
};

interface Service {
  id:string;
  name:string;
  duration:string;
  price:number;
  description:string;
  benefits:string;
  image:string;
}

export default function ServicesPage(){

  const { navigate } = useAppStore();

  const [services,setServices] = useState<Service[]>([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    fetch('/api/services')
      .then(res=>res.json())
      .then(data=>{
        if(data.success){
          setServices(data.services);
        }
      })
      .catch(err=>{
        console.error("Services error:",err);
      })
      .finally(()=>{
        setLoading(false);
      });

  },[]);


  return (
    <div>

      <section className="pt-32 pb-16" style={{background:'#030102'}}>
        <div className="container-tinas text-center">

          <motion.h1
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          className="text-4xl md:text-6xl font-bold heading-display">
            Massage <span className="text-pink-brand">Therapies</span>
          </motion.h1>

          <p className="text-lg text-pink-glow/35 mt-5 body-serif">
            Relax • Restore • Rejuvenate
          </p>

        </div>
      </section>


      <section className="section-padding surface-base">

        <div className="container-tinas">

          {loading && (
            <div className="text-center text-gold py-10">
              Loading treatments...
            </div>
          )}


          <div className="grid md:grid-cols-2 gap-8">

          {services.map((service,index)=>(

            <motion.div
            key={service.id}
            initial="hidden"
            whileInView="visible"
            viewport={{once:true}}
            variants={fadeUp}
            custom={index}
            >

              <div className="surface-raised rounded-2xl overflow-hidden glow-gold">

                <div className="md:flex">

                  {service.image && (
                    <div className="md:w-2/5 h-52">
                      <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      />
                    </div>
                  )}


                  <div className="p-6 md:w-3/5">

                    <p className="text-xs text-gold/60 mb-2">
                      {service.duration.toUpperCase()}
                    </p>


                    <h3 className="text-xl font-bold heading-display">
                      {service.name}
                    </h3>


                    <p className="text-sm text-pink-glow/40 mt-3 mb-5">
                      {service.description}
                    </p>


                    <div className="grid grid-cols-2 gap-2 mb-5">

                      {String(service.benefits || '')
                      .split(',')
                      .map((benefit,i)=>(

                        <div
                        key={i}
                        className="text-xs text-pink-glow/50">

                          ✦ {benefit.trim()}

                        </div>

                      ))}

                    </div>


                    <div className="flex justify-between items-center border-t border-gold/10 pt-4">

                      <span className="text-2xl font-bold text-gradient-gold">
                        K{Number(service.price).toLocaleString()}
                      </span>


                      <button
                      onClick={()=>navigate('contact')}
                      className="btn-pink px-5 py-2 text-xs">

                        Book Now

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          ))}

          </div>

        </div>

      </section>


      <section className="section-dark section-padding">

        <div className="container-tinas">

          <h2 className="text-center text-4xl font-bold heading-display mb-10">
            Find Your Perfect <span className="text-pink-brand">Treatment</span>
          </h2>

          <ComparisonTable />

        </div>

      </section>


      <section className="section-padding surface-base">

        <div className="container-tinas text-center">

          <h2 className="text-4xl font-bold heading-display">
            Ready to book your treatment?
          </h2>

          <button
          onClick={()=>navigate('contact')}
          className="btn-pink mt-8 px-8 py-3">

            Book Appointment

          </button>

        </div>

      </section>


    </div>
  );
}
