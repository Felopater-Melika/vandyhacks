import React from 'react';

export default function Stats() {
    const complaints = ["Pain", "Nausea", "Fatigue", "Anxiety", "Depression", "Insomnia", "Constipation", "Dyspnea", "Anorexia", "Diarrhea"];

    return (
      <>
       <div>
        <h2 className="text-3xl font-bold text-[#14213d] text-center mt-16 underline decoration-[#fca311]">Complaints</h2>
         <div className="w-[300px] sm:w-1/2 bg-[#14213d] text-center mx-auto m-4 rounded-[20px] p-8">
            {complaints.map((complaint, index) => (
            <div className="text-[#e5e5e5] m-4 text-xl font-bold" key={index}>
            {complaint}
            </div>
            ))}
        </div>

        {/* <h2 className="text-3xl font-bold text-[#14213d] text-center mt-16 underline decoration-[#fca311]">Check Ins</h2>
         <div className="w-[300px] sm:w-1/2 bg-[#14213d] text-center mx-auto m-4 rounded-[20px] p-8">
            {complaints.map((complaint, index) => (
            <div className="text-[#e5e5e5] m-4 text-xl font-bold" key={index}>
            {complaint}
            </div>
            ))}
        </div> */}
       </div>
      </>
    )
} 