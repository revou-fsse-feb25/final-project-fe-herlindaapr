'use client';

import { useState, useEffect } from "react";
import { servicesAPI } from "../services/api";
import { Service } from "../types";

export default function Pricelist() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const servicesData = await servicesAPI.getAll();
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Categorize services (you can adjust these categories based on your service names)
  const nailServices = services.filter(service => 
    service.name.toLowerCase().includes('nail') || 
    service.name.toLowerCase().includes('gel') ||
    service.name.toLowerCase().includes('manicure')
  );

  const lashServices = services.filter(service => 
    service.name.toLowerCase().includes('lash') || 
    service.name.toLowerCase().includes('lashes') ||
    service.name.toLowerCase().includes('eyelash')
  );

  return (
    <>
      <div className="w-1/2 flex flex-col justify-center">
        <h2 className="text-stone-600 text-center text-2xl font-bold">Nail Arts</h2>

        {/* NAILS PRICELIST */}
        <ul className="list text-stone-600 mt-6 px-4">
          {isLoadingServices ? (
            <li className="list-row shadow-xs">
              <div className="list-col-grow">
                <div className="font-bold">Loading services...</div>
                <div className="text-xs">Please wait</div>
              </div>
              <div className="font-bold">-</div>
            </li>
          ) : nailServices.length > 0 ? (
            nailServices.map((service) => (
              <li key={service.id} className="list-row shadow-xs">
                <div className="list-col-grow">
                  <div className="font-bold">{service.name}</div>
                  <div className="text-xs">{service.description}</div>
                </div>
                <div className="font-bold">Rp. {service.price.toLocaleString()}</div>
              </li>
            ))
          ) : (
            <li className="list-row shadow-xs">
              <div className="list-col-grow">
                <div className="font-bold">No nail services available</div>
                <div className="text-xs">Check back later</div>
              </div>
              <div className="font-bold">-</div>
            </li>
          )}
        </ul>
      </div>
      
      <span className="border-s border-yellow-900 h-full mt-14"></span>
      
      <div className="w-1/2 flex flex-col">
        <h2 className="text-stone-600 text-center text-2xl font-bold">Eyelashes</h2>

        {/* EYELASHES PRICELIST */}
        <ul className="list text-stone-600 mt-6 px-4">
          {isLoadingServices ? (
            <li className="list-row shadow-xs">
              <div className="list-col-grow">
                <div className="font-bold">Loading services...</div>
                <div className="text-xs">Please wait</div>
              </div>
              <div className="font-bold">-</div>
            </li>
          ) : lashServices.length > 0 ? (
            lashServices.map((service) => (
              <li key={service.id} className="list-row shadow-xs">
                <div className="list-col-grow">
                  <div className="font-bold">{service.name}</div>
                  <div className="text-xs">{service.description}</div>
                </div>
                <div className="font-bold">Rp. {service.price.toLocaleString()}</div>
              </li>
            ))
          ) : (
            <li className="list-row shadow-xs">
              <div className="list-col-grow">
                <div className="font-bold">No eyelash services available</div>
                <div className="text-xs">Check back later</div>
              </div>
              <div className="font-bold">-</div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}