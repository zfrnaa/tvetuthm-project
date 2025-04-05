import { useTheme } from "../../lib/contexts/ThemeTypeContext";
import { CircleX, MoveDiagonal } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// ShadCN modal
import { DialogTitle } from "@radix-ui/react-dialog";

interface CardProps {
  title: string;
  content: string | number | React.JSX.Element;
  subtitle?: string | React.JSX.Element;
  icon: React.JSX.Element;
  graph?: React.JSX.Element;
  modalContent?: React.ReactNode;
}

export const CardWChart: React.FC<CardProps> = ({ title, content, subtitle, icon, graph, modalContent }) => {
  const { isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="flex flex-col p-4 bg-white/90 dark:bg-cyan-900 backdrop-blur-md rounded-2xl max-w-[400px] justify-between outline">
      <div className="flex flex-row justify-between mb-4 gap-4">
        {/* Left Section: Icon and Title */}
        <div className="flex flex-row items-center gap-4">
          <div className="flex justify-center items-center bg-blue-100 rounded-full p-2 dark:bg-darkTextSecondary w-12 h-11">
            {React.cloneElement(icon, {
              color: isDarkMode ? "#0B1828" : "#344BFD",
              fill: isDarkMode ? "#0B1828" : "#344BFD",
              size: 24,
            })}
          </div>
          <p className="text-lg font-semibold geist-sansSBold" style={{ color: isDarkMode ? "#e9f1ff" : "#575757" }}>
            {title}
          </p>
        </div>

        {/* Right Section: Open Modal Button */}
        {(graph || modalContent) && (
          <Dialog open={modalVisible} onOpenChange={setModalVisible}>
            <DialogTrigger asChild>
              {/* <DialogTitle>{title}</DialogTitle> */}
              <button className="w-9 h-9 rounded-full">
                <div className="border-2 w-9 h-9 flex justify-center items-center rounded-full" style={{ borderColor: isDarkMode ? "#8BA6A7" : "#e4e4e4" }}>
                  <MoveDiagonal size={18} color={isDarkMode ? "#D2D8E3" : "#6B7280"} />
                </div>
              </button>
            </DialogTrigger>

            {/* Fullscreen Modal - FIXED */}
            <DialogContent className="flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg z-50 p-6 border-none" aria-describedby="showing-chart" aria-description="Showing more details">
              <div className="relative bg-white dark:bg-gray-900 w-full max-w-3xl mx-auto rounded-lg shadow-lg p-6 max-h-[90dvh] overflow-y-auto">
                <div className="justify-center">

                  {/* Close Button */}
                  <button onClick={() => setModalVisible(false)} className="absolute top-7 right-4">
                    <CircleX size={24} className="transition" />
                  </button>

                  <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{title}</DialogTitle>
                </div>

                {/* Scrollable Content */}
                <div className="w-full h-full">
                  {modalContent}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content & Graph */}
      <div className="flex flex-row">
        <div className={`${graph ? "flex-1 flex-col" : "flex-col"} self-end`}>
          {subtitle && (
            <p className={`font-medium geist-sansMedium text-gray-600 dark:text-white ${subtitle.toString().startsWith('#') ? 'text-xl' : 'text-lg'}`}>
              {subtitle.toString().startsWith('#') ? subtitle.toString().substring(0) : subtitle}
            </p>
          )}
          <span className="text-3xl text-justify font-bold montserratBold text-primaryCustom dark:text-darkText">{content}</span>
        </div>
        <div className="flex-2 items-end pl-4">{graph}</div>
      </div>
    </div>
  );
};
