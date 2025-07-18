'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function OffersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen bg-[#b3e0ef] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-center text-white bg-[#6ec1e4] w-full py-4 rounded-t-2xl mb-6 tracking-wide">OFFERS</h1>
        <div className="w-full flex flex-col gap-4 mb-6">
          <div className="text-xl font-bold text-[#2196b6] text-center mb-2">Unlock Smilescope premium features</div>
          <ul className="text-gray-700 text-base font-medium mb-2 list-disc list-inside">
            <li>Separate prices, charge by hour</li>
            <li>book an appointment - <span className="font-bold">RM 5</span></li>
            <li>chat with local dentists - <span className="font-bold">RM 5</span></li>
            <li>get your own AI diagnosis - <span className="font-bold">RM 3</span></li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center mb-6">
          <div className="flex-1 bg-[#2196b6] rounded-xl p-6 flex flex-col items-center relative">
            <div className="text-lg font-bold text-white mb-1">Per Hour <span className="ml-1">🔒</span></div>
            <div className="text-3xl font-extrabold text-white mb-2">RM 10</div>
            <button className="bg-white text-[#2196b6] font-bold rounded-lg px-4 py-2 mt-2 shadow hover:bg-gray-100 transition" onClick={() => setShowModal(true)}>Purchase now</button>
          </div>
          <div className="flex-1 bg-[#2196b6] rounded-xl p-6 flex flex-col items-center relative">
            <div className="text-lg font-bold text-white mb-1">Unlimited</div>
            <div className="text-3xl font-extrabold text-white mb-2">RM 50</div>
            <button className="bg-white text-[#2196b6] font-bold rounded-lg px-4 py-2 mt-2 shadow hover:bg-gray-100 transition" onClick={() => setShowModal(true)}>Purchase now</button>
            <div className="absolute top-2 right-2 bg-[#fff] text-[#2196b6] font-bold text-xs px-3 py-1 rounded-full shadow border border-[#b3e0ef]">Save 20%</div>
          </div>
        </div>
        <div className="w-full bg-[#eaf6fa] rounded-xl p-4 mb-4">
          <div className="font-bold text-gray-700 mb-2">SPECIAL OFFER :</div>
          <div className="font-semibold text-gray-700 mb-1">For dental clinics ONLY</div>
          <ul className="text-gray-700 text-base font-medium list-disc list-inside mb-1">
            <li>get your dental clinic + fellow dentist’s contact on the list with just a fee of <span className="font-bold">RM 5 per hour</span></li>
            <li><span className="font-bold">20% commission fee monthly</span></li>
          </ul>
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          This subscription renews automatically until canceled<br />
          <span className="underline cursor-pointer">Private Policy</span> &gt; <span className="underline cursor-pointer">Terms of Use</span>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-[#1c2a36]/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-12 flex flex-col items-center relative shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-[#888] hover:text-[#444] text-3xl font-bold focus:outline-none" aria-label="Close">
              &times;
            </button>
            <img src="/smilechat logo.jpg" alt="SmileChat Logo" className="w-40 h-40 mb-8 rounded-full object-cover" />
            <div className="text-3xl font-bold text-black text-center font-poppins">Payment done <span role="img" aria-label="money">💸</span></div>
          </div>
        </div>
      )}
    </main>
  );
} 