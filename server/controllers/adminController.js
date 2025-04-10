const db = require("../config/db.js");

const getAllDoctors = async (req, res) => {
    try {
        // Get total count
        const countResult = await db.one(
            "SELECT COUNT(*) as total FROM doctors"
        );
        const total = parseInt(countResult.total) || 0;

        // Get doctors
        const query = "SELECT * FROM doctors;";
        const result = await db.any(query);

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total: total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while fetching doctors",
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        // Get appointments with doctor, user, and slot information
        const query = `
            SELECT 
                a.id, 
                a.user_id, 
                a.doctor_id, 
                a.slot_id, 
                a.appointment_type, 
                a.status, 
                a.appointment_date,
                d.name as doctor_name, 
                d.specialty as doctor_specialty,
                u.user_name,
                s.slot_time
            FROM appointments a
            LEFT JOIN doctors d ON a.doctor_id = d.id
            LEFT JOIN users u ON a.user_id = u.user_id
            LEFT JOIN slots s ON a.slot_id = s.id
            ORDER BY a.appointment_date, s.slot_time;
        `;
        const result = await db.any(query);

        // Format the data to match frontend expectations
        const appointments = result.map((app) => ({
            id: app.id,
            patientName: app.user_name || "Unknown Patient",
            date: app.appointment_date,
            slot_time: app.slot_time || "00:00:00",
            doctorId: app.doctor_id,
            doctorName: app.doctor_name || "Unknown Doctor",
            status: app.status || "pending",
        }));

        return res.status(200).json({
            ok: true,
            data: appointments,
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while fetching appointments",
        });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        if (!appointmentId || !status) {
            return res.status(400).json({
                ok: false,
                message: "Appointment ID and status are required",
            });
        }

        // Update appointment status
        const query = `
            UPDATE appointments 
            SET status = $1 
            WHERE id = $2 
            RETURNING *;
        `;

        const result = await db.oneOrNone(query, [status, appointmentId]);

        if (!result) {
            return res.status(404).json({
                ok: false,
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            ok: true,
            data: result,
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while updating appointment status",
        });
    }
};

const createDoctor = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            specialization,
            experience,
            address,
            avatarUrl,
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !specialization) {
            return res.status(400).json({
                ok: false,
                message: "Required fields are missing",
            });
        }

        // Create full name from first and last name
        const fullName = `${firstName} ${lastName}`;

        // Insert the new doctor based on actual schema
        const query = `
            INSERT INTO doctors (
                name, 
                specialty, 
                experience,
                rating,
                location,
                profile_pic,
                gender
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, specialty;
        `;

        const result = await db.one(query, [
            fullName,
            specialization,
            experience ? parseInt(experience) : 0,
            0, // Default rating
            address || null,
            avatarUrl || null,
            "male", // Default gender, adjust as needed
        ]);

        return res.status(201).json({
            ok: true,
            data: result,
            message: "Doctor created successfully",
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while creating the doctor",
        });
    }
};

module.exports = {
    getAllDoctors,
    getAppointments,
    updateAppointmentStatus,
    createDoctor,
};
