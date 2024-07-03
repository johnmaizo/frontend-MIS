import axios from "axios";

export const addStudent = async (student) => {
    try {
        const response = await axios.post("/students/add-student", student);
        return response.data;
    } catch (error) {
        console.error("Error adding student:", error);
        throw error;
    }
}
