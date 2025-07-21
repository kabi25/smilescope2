'use client';
import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function OffersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#aedae8] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#74a8bc] rounded-3xl shadow-xl p-12 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center text-white mb-6 tracking-wider">OFFERS</h1>
        <div className="w-full flex flex-col gap-4 mb-6 text-center">
          <div className="bg-white/90 rounded-xl px-8 py-6 mb-4">
            <div className="text-xl font-bold text-[#1c788c] mb-2">Unlock Smilescope premium features</div>
            <ul className="text-[#1c788c] text-base font-medium space-y-1">
              <li>Separate prices, charge by hour</li>
              <li>• book an appointment - <span className="font-bold text-[#1c788c]">RM 5</span></li>
              <li>• chat with local dentists - <span className="font-bold text-[#1c788c]">RM 5</span></li>
              <li>• get your own AI diagnosis - <span className="font-bold text-[#1c788c]">RM 3</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row gap-6 w-full justify-center mb-8">
          <div className="flex-1 bg-[#1c788c] rounded-2xl p-6 flex flex-col items-center text-white">
            <div className="text-lg font-bold mb-1 flex items-center gap-2">Per Hour <Lock size={16} /></div>
            <div className="text-4xl font-extrabold mb-2">RM 10</div>
            <button className="text-white/80 font-semibold text-sm hover:text-white transition" onClick={() => setShowModal(true)}>Purchase now</button>
          </div>
          <div className="flex-1 bg-[#1c788c] rounded-2xl p-6 flex flex-col items-center text-white relative">
            <div className="text-lg font-bold mb-1">Unlimited</div>
            <div className="text-4xl font-extrabold mb-2">RM50</div>
            <button className="text-white/80 font-semibold text-sm hover:text-white transition" onClick={() => setShowModal(true)}>Purchase now</button>
            {/* Save 20% badge */}
            <div className="absolute top-3 right-3">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                <div className="text-center">
                  <div className="font-bold text-xs text-[#1c788c] leading-tight">Save</div>
                  <div className="font-extrabold text-sm text-[#1c788c]">20%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white/90 rounded-xl p-6 mb-4 relative">
          <div className="font-bold text-[#1c788c] mb-2">SPECIAL OFFER :</div>
          <div className="font-semibold text-[#1c788c] mb-1">For dental clinics ONLY</div>
          <ul className="text-[#1c788c] text-base font-medium list-disc list-inside space-y-1">
            <li>get your dental clinic + fellow dentist’s contact on the list with just a fee of <span className="font-bold">RM5 per hour</span></li>
            <li><span className="font-bold">20% commission fee monthly</span></li>
          </ul>
        </div>
        <div className="text-xs text-white text-center mt-2">
          This subscription renews automatically until canceled<br />
          <span className="underline cursor-pointer">Private Policy</span> &gt; <span className="underline cursor-pointer">Terms of Use</span>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl max-w-xs w-full p-8 flex flex-col items-center relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#888] hover:text-[#444] text-2xl font-bold focus:outline-none" aria-label="Close">&times;</button>
            <div className="text-3xl font-bold text-[#1c788c] text-center font-poppins mb-2">Payment done</div>
            <div className="text-5xl mb-4">💸</div>
            <div className="text-base text-gray-700 text-center">Thank you for your purchase!</div>
          </div>
        </div>
      )}
    </main>
  );
} 