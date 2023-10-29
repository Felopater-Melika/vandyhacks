import React from 'react';

export default function Stats() {
    const complaints = [{text: "hello", date: "01/01/2023"}, {text: "goodbye", date: "01/02/2023"}];

    return (
      <>
       <div>
        <h2 className="text-3xl font-bold text-[#14213d] text-center mt-16 underline decoration-[#fca311]">Complaints</h2>
        <div className="w-[300px] sm:w-1/2 bg-[#14213d] text-center mx-auto m-4 rounded-[20px] p-8">
            {complaints.map((complaint, index) => (
            <div className="text-[#e5e5e5] m-4 text-xl" key={index}>
                <h3 className="font-bold">{complaint.date}</h3>
                <p>{complaint.text}</p>
            </div>
            ))}
        </div>

       </div>
      </>
    )
} 