import React, { useEffect, useState } from 'react';

export default function Stats() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // I'm assuming you want to POST the patientId for now. Adjust as needed.
                const response = await fetch('/api/careTaker', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ patientId: 1 }) // Here we hardcode patientId as 1 for testing purposes.
                });

                const data = await response.json();
                setComplaints(data.complaints);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div>
                <h2 className="text-3xl font-bold text-[#14213d] text-center mt-16 underline decoration-[#fca311]">Complaints</h2>
                <div className="w-[300px] sm:w-1/2 bg-[#14213d] text-center mx-auto m-4 rounded-[20px] p-8">
                    {complaints.map((complaint, index) => (
                        <div className="text-[#e5e5e5] m-4 text-xl" key={index}>
                            <p>{complaint}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
