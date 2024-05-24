import { fetchData } from "@/utils/api";

export default async function CheckUserLog() {

    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        // Fetch user details from the server API
        const user = await fetchData("User/me", "GET", null, token);
        return user;
    } catch (error) {
        return false;
    }


}