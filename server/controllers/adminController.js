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

module.exports = {
    getAllDoctors,
};
