"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function AddDoctorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        specialty: "",
        experience: "",
        location: "",
        profilePic: "",
        gender: "male",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Required fields check
        const requiredFields = ["firstName", "lastName", "specialty"];
        const missingFields = requiredFields.filter(
            (field) => !formData[field as keyof typeof formData]
        );

        if (missingFields.length > 0) {
            setError(
                `Please fill in all required fields: ${missingFields.join(
                    ", "
                )}`
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/api/admin/doctor",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        specialization: formData.specialty,
                        experience: formData.experience,
                        address: formData.location,
                        avatarUrl: formData.profilePic,
                        gender: formData.gender,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create doctor");
            }

            // Navigate back to dashboard after successful creation
            router.push("/dashboard");
        } catch (err) {
            console.error("Error creating doctor:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create doctor. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const specializations = [
        "Cardiologist",
        "Dermatologist",
        "Endocrinologist",
        "Gastroenterologist",
        "Neurologist",
        "Obstetrician",
        "Ophthalmologist",
        "Orthopedist",
        "Pediatrician",
        "Psychiatrist",
        "Urologist",
    ];

    return (
        <div className={styles.formContainer}>
            <header className={styles.formHeader}>
                <h1>Add New Doctor</h1>
                <Link href="/dashboard" className={styles.backLink}>
                    Back to Dashboard
                </Link>
            </header>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.doctorForm}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter first name"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            required
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="specialty">Specialization *</label>
                        <select
                            id="specialty"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Specialization</option>
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="experience">Years of Experience</label>
                        <input
                            type="number"
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Years of experience"
                            min="0"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="location">Location/Address</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter clinic address"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="profilePic">Profile Image URL</label>
                    <input
                        type="text"
                        id="profilePic"
                        name="profilePic"
                        value={formData.profilePic}
                        onChange={handleChange}
                        placeholder="Enter profile image URL"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="gender">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        className={styles.secondary}
                        onClick={() => router.push("/dashboard")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.primary}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Doctor"}
                    </button>
                </div>
            </form>
        </div>
    );
}
