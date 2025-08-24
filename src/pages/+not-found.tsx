import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Error404Icon from "../assets/images/error404_svg.svg";

const NotFound = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    //redirect to home page after 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Navigate when seconds reaches 0.
    useEffect(() => {
        if (seconds <= 0) {
            navigate("/");
        }
    }, [seconds, navigate]);

    return (
        <div className="flex flex-col items-center h-screen mt-20">
            <img src={Error404Icon} alt="404 Error" style={{ width: 500, height: 500 }} />
            <div className="bg-black rounded-full px-4 py-2">
                <p className="text-white">
                    Mengalihkan ke Laman Utama dalam {seconds} saat...
                </p>
            </div>
        </div>
    );
};

export default NotFound;