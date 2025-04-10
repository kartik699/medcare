"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Types for the data based on actual schema
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    experience?: number;
    rating?: number;
    location?: string;
    profile_pic?: string;
    gender?: string;
}

interface Appointment {
    id: number;
    patientName: string;
    date: string;
    time: string;
    doctorId: number;
    doctorName: string;
    status: string;
}

export default function Dashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch doctors and appointments
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch doctors
                const doctorsResponse = await fetch(
                    "http://localhost:3001/api/admin"
                );
                if (!doctorsResponse.ok) {
                    throw new Error("Failed to fetch doctors");
                }
                const doctorsData = await doctorsResponse.json();

                // Fetch appointments
                const appointmentsResponse = await fetch(
                    "http://localhost:3001/api/admin/appointments"
                );
                if (!appointmentsResponse.ok) {
                    throw new Error("Failed to fetch appointments");
                }
                const appointmentsData = await appointmentsResponse.json();

                // Update state
                if (doctorsData.ok) {
                    setDoctors(doctorsData.data.rows);
                }

                if (appointmentsData.ok) {
                    setAppointments(appointmentsData.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (
        appointmentId: number,
        newStatus: string
    ) => {
        try {
            const response = await fetch(
                "http://localhost:3001/api/admin/appointment/status",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        appointmentId,
                        status: newStatus,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update appointment status");
            }

            // Update the UI optimistically
            setAppointments(
                appointments.map((app) =>
                    app.id === appointmentId
                        ? { ...app, status: newStatus }
                        : app
                )
            );
        } catch (err) {
            console.error("Error updating appointment status:", err);
            setError("Failed to update appointment status. Please try again.");
        }
    };

    // Helper function to display status in a user-friendly way
    const formatStatus = (status: string) => {
        switch (status) {
            case "confirmed":
                return "Approved";
            case "rejected":
                return "Declined";
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h1>Admin Dashboard</h1>
                <div className={styles.actionButtons}>
                    <Link
                        href="/dashboard/add-doctor"
                        className={styles.primary}
                    >
                        Add New Doctor
                    </Link>
                </div>
            </header>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.appointmentsSection}>
                <h2>Upcoming Appointments</h2>

                {loading ? (
                    <div className={styles.loadingSpinner}>
                        Loading appointments...
                    </div>
                ) : (
                    <table className={styles.appointmentsTable}>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.patientName}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>
                                            <span
                                                className={`${styles.status} ${
                                                    styles[appointment.status]
                                                }`}
                                            >
                                                {formatStatus(
                                                    appointment.status
                                                )}
                                            </span>
                                        </td>
                                        <td className={styles.actionButtons}>
                                            {appointment.status ===
                                                "pending" && (
                                                <>
                                                    <button
                                                        className={
                                                            styles.approveBtn
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                appointment.id,
                                                                "confirmed"
                                                            )
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className={
                                                            styles.declineBtn
                                                        }
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                appointment.id,
                                                                "rejected"
                                                            )
                                                        }
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {appointment.status ===
                                                "confirmed" && (
                                                <span
                                                    className={
                                                        styles.approvedText
                                                    }
                                                >
                                                    Approved
                                                </span>
                                            )}
                                            {appointment.status ===
                                                "rejected" && (
                                                <span
                                                    className={
                                                        styles.declinedText
                                                    }
                                                >
                                                    Declined
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className={styles.noAppointments}
                                    >
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className={styles.doctorSection}>
                <h2>Doctors</h2>
                {loading ? (
                    <div className={styles.loadingSpinner}>
                        Loading doctors...
                    </div>
                ) : (
                    <div className={styles.doctorsList}>
                        {doctors.length > 0 ? (
                            doctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className={styles.doctorCard}
                                >
                                    <h3>{doctor.name}</h3>
                                    <p className={styles.specialization}>
                                        {doctor.specialty}
                                    </p>
                                    {doctor.experience && (
                                        <p className={styles.experience}>
                                            Experience: {doctor.experience}{" "}
                                            years
                                        </p>
                                    )}
                                    {doctor.rating && (
                                        <p className={styles.rating}>
                                            Rating: {doctor.rating}/5
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className={styles.noDoctors}>No doctors found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
