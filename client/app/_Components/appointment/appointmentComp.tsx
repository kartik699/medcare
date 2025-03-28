"use client";

import Calendar from "../Calender/showCalender";
import style from "./booking.module.css";
import { useState, useEffect } from "react";
import { formatTime } from "@/utils/formatTime";
import { validateSlots } from "@/utils/validateSlots";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3001/api";

export interface Slot {
    id: number;
    doctor_id: number;
    slot_time: string;
    slot_type: "morning" | "evening";
    is_available: boolean;
}

interface AppointmentProps {
    doctorId: number;
}

export default function Appointment({ doctorId }: AppointmentProps) {
    const [offlineGreen, setOfflineGreen] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [appointmentType, setAppointmentType] = useState<
        "online" | "offline"
    >("online");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const HospitalList = ["MediCareHeart Institute, Okhla Road"];

    useEffect(() => {
        if (doctorId) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    // fetch available slots and validate them
    const fetchAvailableSlots = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_BASE_URL}/appointments/available-slots/${doctorId}/${selectedDate}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || "Failed to fetch slots");
                setError(errorData.message || "Failed to fetch slots");
                return;
            }

            const data = await response.json();

            // Ensure all slot data has the required fields and mark past slots as unavailable
            const validatedSlots = validateSlots(data, selectedDate);

            setSlots(validatedSlots);
        } catch (err) {
            toast.error(
                "Network error. Please check your connection and try again."
            );
            setError(
                "Network error. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedSlotId) {
            const errorMessage = "Please select a time slot";
            setError(errorMessage);
            toast.error(errorMessage);
            return;
        }

        try {
            setLoading(true);

            // Immediately disable the selected slot in the UI for better UX
            setSlots((currentSlots) =>
                currentSlots.map((slot) =>
                    slot.id === selectedSlotId
                        ? { ...slot, is_available: false }
                        : slot
                )
            );

            const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    doctorId,
                    slotId: selectedSlotId,
                    appointmentType,
                    appointmentDate: selectedDate,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // If booking failed, revert the slot to available
                setSlots((currentSlots) =>
                    currentSlots.map((slot) =>
                        slot.id === selectedSlotId
                            ? { ...slot, is_available: true }
                            : slot
                    )
                );

                if (
                    response.status === 400 &&
                    data.message?.includes("already booked")
                ) {
                    // Show toast and refresh slots
                    toast.error(data.message || "Slot already booked");
                    fetchAvailableSlots();
                    return;
                }

                // Show toast for other errors
                toast.error(data.message || "Failed to book appointment");
                setError(data.message || "Failed to book appointment");
                return;
            }

            // Reset selection
            setSelectedSlotId(null);

            toast.success(data.message || "Appointment booked successfully!");

            // Fetch fresh data from server after a short delay
            setTimeout(() => {
                fetchAvailableSlots();
            }, 500);
        } catch (err) {
            setSlots((currentSlots) =>
                currentSlots.map((slot) =>
                    slot.id === selectedSlotId
                        ? { ...slot, is_available: true }
                        : slot
                )
            );

            toast.error(
                "Network error. Please check your connection and try again."
            );
            setError(
                "Network error. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const morningSlots = slots.filter((slot) => slot.slot_type === "morning");
    const eveningSlots = slots.filter((slot) => slot.slot_type === "evening");

    function handleToggle(type: "online" | "offline") {
        setAppointmentType(type);
        setOfflineGreen(type === "online");
    }

    return (
        <main className={style.main}>
            <div className={style.info}>
                <h1>Book your next doctor's visit in Seconds</h1>
                <p>
                    Medcare helps you find the best healthcare provider by
                    specialty, location, and more, ensuring you get the care you
                    need.
                </p>
            </div>
            <div className={style.slotsBackground}>
                <div className={style.slots}>
                    <div className={style.schedule}>
                        <p>Schedule Appointment</p>
                        <button
                            onClick={handleBookAppointment}
                            disabled={loading || !selectedSlotId}
                        >
                            {loading ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                    <div className={style.consult}>
                        <button
                            className={
                                offlineGreen ? style.bgGreen : style.White
                            }
                            onClick={() => handleToggle("online")}
                        >
                            Book Video Consult
                        </button>
                        <button
                            className={
                                !offlineGreen ? style.bgGreen : style.White
                            }
                            onClick={() => handleToggle("offline")}
                        >
                            Book Hospital Visit
                        </button>
                    </div>
                    <select className={style.hospitalList}>
                        {HospitalList.map((hospital, index) => (
                            <option key={index}>{hospital}</option>
                        ))}
                    </select>
                    <Calendar
                        onDateSelect={(date: string) => setSelectedDate(date)}
                    />
                    {error && <div className={style.error}>{error}</div>}
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sun}></div>
                                <div className={style.morning}>Morning</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span>
                                    Slots{" "}
                                    {
                                        morningSlots.filter(
                                            (s) => s.is_available
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {morningSlots.length > 0 ? (
                                morningSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() =>
                                            slot.is_available &&
                                            setSelectedSlotId(slot.id)
                                        }
                                        className={`${
                                            slot.id === selectedSlotId
                                                ? style.bgGreen
                                                : style.bgWhite
                                        } ${
                                            !slot.is_available
                                                ? style.disabled
                                                : ""
                                        }`}
                                        disabled={!slot.is_available}
                                    >
                                        {formatTime(slot.slot_time)}
                                    </button>
                                ))
                            ) : (
                                <div className={style.noSlots}>
                                    No morning slots available
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style.availableSlots}>
                        <div className={style.sunCountOfSlots}>
                            <div className={style.sunMorning}>
                                <div className={style.sunset}></div>
                                <div className={style.morning}>Evening</div>
                            </div>
                            <div className={style.countOfSlots}>
                                <span>
                                    Slots{" "}
                                    {
                                        eveningSlots.filter(
                                            (s) => s.is_available
                                        ).length
                                    }
                                </span>
                            </div>
                        </div>
                        <div className={style.horizontalLine}></div>
                        <div className={style.availableSlotsContainer}>
                            {eveningSlots.length > 0 ? (
                                eveningSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() =>
                                            slot.is_available &&
                                            setSelectedSlotId(slot.id)
                                        }
                                        className={`${
                                            slot.id === selectedSlotId
                                                ? style.bgGreen
                                                : style.bgWhite
                                        } ${
                                            !slot.is_available
                                                ? style.disabled
                                                : ""
                                        }`}
                                        disabled={!slot.is_available}
                                    >
                                        {formatTime(slot.slot_time)}
                                    </button>
                                ))
                            ) : (
                                <div className={style.noSlots}>
                                    No evening slots available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
