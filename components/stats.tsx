import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function Stats() {
    const [complaints, setComplaints] = useState([]);
    const [successfulCheckIns, setSuccessfulCheckIns] = useState([]);
    const [failedCheckIns, setFailedCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);

    console.log("Patient ID:" + localStorage.getItem('patientId'));
    console.log("CareTaker ID:" + localStorage.getItem('careTakerId'));

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post('/api/careTaker', {
                    patientId: localStorage.getItem('patientId')
                });

                console.log("Response:", response.data);
                setComplaints(response.data.complaints);
                setSuccessfulCheckIns(response.data.successfulCheckIns);
                setFailedCheckIns(response.data.failedCheckIns);

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
                <h2 className="text-3xl font-bold text-[#14213d] text-center mt-16 underline decoration-[#635dff]">Stats</h2>
                <div className="w-[300px] sm:w-1/2 bg-[#14213d] text-center mx-auto m-4 rounded-[20px] p-8">
                    <h3 className="text-xl text-[#e5e5e5] font-bold" >Complaints:</h3>
                    {complaints.map((complaint: any, index) => (
                        <div className="text-[#e5e5e5] m-4 text-xl" key={index}>
                            <p>{complaint.description}</p>
                        </div>
                    ))}

                    <h3 className="text-xl text-[#e5e5e5] font-bold">Successful Check Ins:</h3>
                    {successfulCheckIns.map((checkin: any, index) => (
                        <div className="text-[#e5e5e5] m-4 text-xl" key={index}>
                            <p>Date: {checkin.date}</p>
                            <p>Attempt Count: {checkin.attemptCount}</p>
                        </div>
                    ))}
                    <h3 className="text-xl text-[#e5e5e5] font-bold">Failed Check Ins:</h3>
                    {failedCheckIns.map((failCheckin: any, index) => (
                        <div className="text-[#e5e5e5] m-4 text-xl" key={index}>
                            <p>Date: {failCheckin.date}</p>
                            <p>Reached CareTaker: {failCheckin.reachedCareTaker.toString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
