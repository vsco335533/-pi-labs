import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show the back button on the Home page
    if (location.pathname === "/") {
        return null;
    }

    return (
        <div className="px-4 md:px-8 py-4">
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
            >
                <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back
            </button>
        </div>
    );
}
