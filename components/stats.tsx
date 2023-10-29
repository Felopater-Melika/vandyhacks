import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function Stats({careTaker}: any) {
    const [complaints, setComplaints] = useState([]);
    const [successfulCheckIns, setSuccessfulCheckIns] = useState([]);
    const [failedCheckIns, setFailedCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.post('/api/careTaker', {
                    patientId: careTaker.patientId
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
            <Card className='border-2'>
                <CardHeader className="text-3xl  text-center ">Stats</CardHeader>
                <CardContent className="">
                    <h3 className="text-xl" >Complaints:</h3>
                    {complaints.map((complaint: any, index) => (
                        <div className="text-xl" key={index}>
                            <p>{complaint.description}</p>
                        </div>
                    ))}
                    <h3 className="text-xl ">Successful Check Ins:</h3>
                    {successfulCheckIns.map((checkin: any, index) => (
                        <div className="text-xl" key={index}>
                            <p>Date: {checkin.date}</p>
                            <p>Attempt Count: {checkin.attemptCount}</p>
                        </div>
                    ))}
                    <h3 className="text-xl">Failed Check Ins:</h3>
                    {failedCheckIns.map((failCheckin: any, index) => (
                        <div className="text-xl" key={index}>
                            <p>Date: {failCheckin.date}</p>
                            <p>Reached CareTaker: {failCheckin.reachedCareTaker.toString()}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
    )
}
