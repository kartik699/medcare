"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

// Mock data for doctors and appointments
const mockDoctors = [
    { id: 1, name: "Dr. John Smith", specialization: "Cardiologist" },
    { id: 2, name: "Dr. Sarah Johnson", specialization: "Neurologist" },
    { id: 3, name: "Dr. Robert Chen", specialization: "Pediatrician" },
];

const mockAppointments = [
    {
        id: 1,
        patientName: "Michael Brown",
        date: "2023-10-15",
        time: "10:30 AM",
        doctorId: 1,
        status: "pending",
    },
    {
        id: 2,
        patientName: "Emma Wilson",
        date: "2023-10-15",
        time: "11:45 AM",
        doctorId: 2,
        status: "pending",
    },
    {
        id: 3,
        patientName: "James Taylor",
        date: "2023-10-16",
        time: "09:15 AM",
        doctorId: 3,
        status: "pending",
    },
    {
        id: 4,
        patientName: "Sophia Garcia",
        date: "2023-10-16",
        time: "02:30 PM",
        doctorId: 1,
        status: "pending",
    },
];

export default function Dashboard() {
    const [appointments, setAppointments] = useState(mockAppointments);

    const handleStatusChange = (appointmentId: number, newStatus: string) => {
        setAppointments(
            appointments.map((app) =>
                app.id === appointmentId ? { ...app, status: newStatus } : app
            )
        );
    };

    const getDoctorName = (doctorId: number) => {
        const doctor = mockDoctors.find((doc) => doc.id === doctorId);
        return doctor ? doctor.name : "Unknown Doctor";
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

            <div className={styles.appointmentsSection}>
                <h2>Upcoming Appointments</h2>

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
                                    <td>
                                        {getDoctorName(appointment.doctorId)}
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${
                                                styles[appointment.status]
                                            }`}
                                        >
                                            {appointment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                appointment.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className={styles.actionButtons}>
                                        {appointment.status === "pending" && (
                                            <>
                                                <button
                                                    className={
                                                        styles.approveBtn
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            appointment.id,
                                                            "approved"
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
                                                            "declined"
                                                        )
                                                    }
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === "approved" && (
                                            <span
                                                className={styles.approvedText}
                                            >
                                                Approved
                                            </span>
                                        )}
                                        {appointment.status === "declined" && (
                                            <span
                                                className={styles.declinedText}
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
            </div>
        </div>
    );
}
