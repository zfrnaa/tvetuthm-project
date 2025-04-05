import React from "react";
import RuangMaklumat from "../components/RuangMaklumat";

const Maklumat: React.FC = () => {

    return (
        <div className="min-w-screen min-h-screen relative">
            <div className="absolute inset-0" />
            <div className="p-4">
                <RuangMaklumat />
            </div>
        </div>
    );
};

export default Maklumat;
