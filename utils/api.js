import { toast } from "react-toastify";
import API_ENDPOINT from "@/utils/API_ENDPOINT";

const apiUrl = API_ENDPOINT + "api/v1";

export async function fetchData(endpoint, method = "GET", data = null, token = null, message = false, noEmpty = true) {
    const url = `${apiUrl}/${endpoint}`;

    if (message) {
        toast.info("درحال پردازش لطفا صبر کنید", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (token) {
        token = "Bearer " + token;
        options.headers.Authorization = `${token}`;
    }

    if (data) {
        if (noEmpty) {
            data = removeEmpty(data);
        }
        console.log(data);
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }

    // remove empty parts of obj
    function removeEmpty(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') {
                removeEmpty(obj[key]);
            } else if (obj[key] == null || obj[key] === '') {
                delete obj[key];
            }
        });
        return obj;
    }

}
