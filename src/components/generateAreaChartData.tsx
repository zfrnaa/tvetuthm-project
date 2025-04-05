"use client";

export const generateAreaChartData = () => {
  const data = [];
  const today = new Date();
  // Generates data for the current month and the previous 5 months (total 6 months)
  for (let i = 4; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    data.push({
      month: d.toLocaleString("default", { month: "short" }),
      desktop: Math.floor(Math.random() * 300) + 50, // Random value between 50 and 350
      mobile: Math.floor(Math.random() * 200) + 30, // Random value between 30 and 230
    });
  }
  return data;
};
