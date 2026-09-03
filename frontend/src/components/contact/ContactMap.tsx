'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

const officeLocations = {
  jeddah: {
    name: 'Jeddah HQ',
    address: 'Othman Bin Afan Street, Jeddah 22234, Saudi Arabia',
    embedUrl: 'https://maps.google.com/maps?q=Othman%20Bin%20Afan%20Street,%20Jeddah,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed'
  },
  dammam: {
    name: 'Dammam Branch',
    address: 'Petromin Business Center, Dammam, Saudi Arabia',
    embedUrl: 'https://maps.google.com/maps?q=Petromin%20Business%20Center,%20Dammam,%20Saudi%20Arabia&t=&z=14&ie=UTF8&iwloc=&output=embed'
  }
};

export default function ContactMap() {
  const [activeOffice, setActiveOffice] = useState<'jeddah' | 'dammam'>('jeddah');

  return (
    <div className="border border-[#D9DDE1] p-4 rounded-sm bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DDE1] pb-3">
        <span className="font-mono text-[#59616B] text-[10px] uppercase tracking-widest block">
          02 // Location Map
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveOffice('jeddah')}
            className={`px-3 py-1 font-display text-[9px] font-bold uppercase tracking-widest transition-all ${
              activeOffice === 'jeddah'
                ? 'bg-[#111318] text-white'
                : 'bg-slate-100 text-[#59616B] hover:bg-slate-200'
            }`}
          >
            Jeddah
          </button>
          <button
            onClick={() => setActiveOffice('dammam')}
            className={`px-3 py-1 font-display text-[9px] font-bold uppercase tracking-widest transition-all ${
              activeOffice === 'dammam'
                ? 'bg-[#111318] text-white'
                : 'bg-slate-100 text-[#59616B] hover:bg-slate-200'
            }`}
          >
            Dammam
          </button>
        </div>
      </div>

      <div className="relative h-[220px] w-full bg-slate-100 rounded-sm overflow-hidden border border-[#D9DDE1]">
        <iframe
          src={officeLocations[activeOffice].embedUrl}
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title={`${officeLocations[activeOffice].name} map`}
        />
      </div>

      <div className="flex items-start gap-2 text-[#59616B]">
        <MapPin className="w-3.5 h-3.5 text-[#E8612C] shrink-0 mt-0.5" />
        <p className="font-sans text-[10px] uppercase tracking-wider leading-relaxed">
          {officeLocations[activeOffice].address}
        </p>
      </div>
    </div>
  );
}
