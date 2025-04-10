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
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        address: "",
        bio: "",
        password: "",
        confirmPassword: "",
        avatarUrl: "",
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

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        // Required fields check
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "specialization",
        ];
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

            // This would be replaced with an actual API call
            console.log("Creating doctor:", formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Navigate back to dashboard after successful creation
            router.push("/dashboard");
        } catch (err) {
            console.error("Error creating doctor:", err);
            setError("Failed to create doctor. Please try again.");
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
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="specialization">Specialization *</label>
                        <select
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
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
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter clinic address"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Enter doctor's bio and qualifications"
                        rows={4}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="avatarUrl">Profile Image URL</label>
                    <input
                        type="text"
                        id="avatarUrl"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="Enter profile image URL"
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                        />
                    </div>
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
