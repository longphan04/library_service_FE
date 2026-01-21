import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { buildTooltip, buildTooltipCompareTwo } from "../../../utils/hs-apexcharts-helpers";

export default function Statistics() {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("12_weeks"); // "12_weeks" or "12_months"

    // Mock Data
    const mockData = {
        users: {
            "12_weeks": {
                categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12"],
                data: [120, 150, 180, 200, 250, 300, 280, 320, 350, 400, 420, 450]
            },
            "12_months": {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                data: [500, 600, 750, 800, 950, 1100, 1050, 1200, 1350, 1500, 1600, 1800]
            }
        },
        borrowReturn: {
            "12_weeks": {
                categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12"],
                borrow: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
                return: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]
            },
            "12_months": {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                borrow: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750],
                return: [180, 230, 280, 490, 380, 430, 480, 530, 580, 630, 680, 730]
            }
        }
    };

    // User Statistics Chart Config
    const userChartOptions = {
        chart: {
            height: 300,
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [{
            name: "Users",
            data: mockData.users[timeRange].data
        }],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        grid: {
            strokeDashArray: 2
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        xaxis: {
            type: "category",
            categories: mockData.users[timeRange].categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: {
            labels: {
                align: "left",
                minWidth: 0,
                maxWidth: 140,
                style: { colors: "#9ca3af", fontSize: "12px", fontFamily: "Inter, ui-sans-serif" },
                formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
            }
        },
        tooltip: {
            custom: function (props) {
                return buildTooltip(props, {
                    title: `User Stats (${timeRange.replace("_", " ")})`,
                    mode: "light",
                    valuePrefix: "",
                    hasTextLabel: true,
                    markerClasses: "w-2.5 h-2.5 rounded-full me-2",
                    wrapperClasses: "bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md p-2",
                    titleClasses: "font-semibold text-sm mb-2 border-b border-gray-200 pb-1"
                });
            }
        },
        colors: ["#2563eb"]
    };

    // Borrow/Return Chart Config
    const borrowReturnChartOptions = {
        chart: {
            height: 300,
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [
            { name: "Borrow", data: mockData.borrowReturn[timeRange].borrow },
            { name: "Return", data: mockData.borrowReturn[timeRange].return }
        ],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        grid: {
            strokeDashArray: 2
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100]
            }
        },
        xaxis: {
            type: "category",
            categories: mockData.borrowReturn[timeRange].categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false }
        },
        yaxis: {
            labels: {
                align: "left",
                minWidth: 0,
                maxWidth: 140,
                style: { colors: "#9ca3af", fontSize: "12px", fontFamily: "Inter, ui-sans-serif" },
                formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
            }
        },
        tooltip: {
            custom: function (props) {
                return buildTooltipCompareTwo(props, {
                    title: `Borrow vs Return (${timeRange.replace("_", " ")})`,
                    mode: "light",
                    valuePrefix: "",
                    hasTextLabel: true,
                    markerClasses: "w-2.5 h-2.5 rounded-full me-2",
                    wrapperClasses: "bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md p-2",
                    titleClasses: "font-semibold text-sm mb-2 border-b border-gray-200 pb-1"
                });
            }
        },
        colors: ["#2563eb", "#d946ef"]
    };

    return (
        <div className="w-full bg-[#F6EFE7] min-h-screen pb-10">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-6 mb-6 text-center text-[#4A3728]">
                Thống kê
            </h1>

            {/* TAB BUTTONS */}
            <div className="flex justify-center gap-4 mb-10">
                <button
                    className="px-6 py-2 rounded-full bg-[#D9A37B] text-white cursor-default shadow-sm"
                >
                    Thống kê
                </button>

                <button
                    onClick={() => navigate("/admin/inventory")}
                    className="px-6 py-2 rounded-full bg-[#E2C6A6] text-[#7A4A2E] hover:opacity-90 hover:bg-[#D4B595] transition-colors"
                >
                    Tồn kho
                </button>

                <button
                    onClick={() => navigate("/admin/inventory-log")}
                    className="px-6 py-2 rounded-full bg-[#E2C6A6] text-[#7A4A2E] hover:opacity-90 hover:bg-[#D4B595] transition-colors"
                >
                    Biến động kho
                </button>
            </div>

            {/* TIME RANGE SELECTOR */}
            <div className="flex justify-end max-w-6xl mx-auto mb-4 px-4">
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-[#D9A37B] bg-white text-[#7A4A2E] focus:outline-none focus:ring-2 focus:ring-[#D9A37B]"
                >
                    <option value="12_weeks">12 Tuần gần nhất</option>
                    <option value="12_months">12 Tháng gần nhất</option>
                </select>
            </div>

            {/* CHARTS CONTAINER */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 px-4">

                {/* USER STATISTICS CHART */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-[#E2C6A6]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[#4A3728]">Thống kê người dùng</h2>
                        {/* Legend Indicator */}
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                            <span className="text-sm text-gray-600">Người dùng</span>
                        </div>
                    </div>
                    <div id="hs-multiple-area-charts">
                        <Chart
                            options={userChartOptions}
                            series={userChartOptions.series}
                            type="area"
                            height={300}
                        />
                    </div>
                </div>

                {/* BORROW/RETURN STATISTICS CHART */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-[#E2C6A6]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[#4A3728]">Thống kê lượt mượn - trả sách</h2>
                        {/* Legend Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                                <span className="text-sm text-gray-600">Mượn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#d946ef]"></span>
                                <span className="text-sm text-gray-600">Trả</span>
                            </div>
                        </div>
                    </div>
                    <div id="hs-multiple-area-charts-compare-two-tooltip">
                        <Chart
                            options={borrowReturnChartOptions}
                            series={borrowReturnChartOptions.series}
                            type="area"
                            height={300}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}