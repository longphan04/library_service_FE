import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { buildTooltip, buildTooltipCompareTwo } from "../../../utils/hs-apexcharts-helpers";
import { getBorrowApprovedStats, getTicketFlowStats } from "../../../services/dashboard.service";

export default function Statistics() {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState("week"); // "week" or "month"
    const [borrowReturnData, setBorrowReturnData] = useState(null);
    const [ticketFlowData, setTicketFlowData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch borrow-return statistics
    useEffect(() => {
        const fetchBorrowApprovedStats = async () => {
            setLoading(true);
            try {
                const response = await getBorrowApprovedStats(timeRange);
                setBorrowReturnData(response.data);
            } catch (error) {
                console.error('Failed to fetch borrow-approved statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowApprovedStats();
    }, [timeRange]);

    // Fetch ticket flow statistics
    useEffect(() => {
        const fetchTicketFlowStats = async () => {
            setLoading(true);
            try {
                const response = await getTicketFlowStats(timeRange);
                setTicketFlowData(response.data);
            } catch (error) {
                console.error('Failed to fetch ticket flow statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketFlowStats();
    }, [timeRange]);

    // Helper function to format labels - show month only on first and last day
    const formatChartLabels = (labels) => {
        if (!labels || labels.length === 0) return labels;
        
        return labels.map((label, index) => {
            // First and last items keep full format (with month)
            if (index === 0 || index === labels.length - 1) {
                return label; // Keep original format like "15/01"
            }
            // Middle items remove month part (keep only day)
            // Example: "15/01" becomes "15"
            return label.split('/')[0];
        });
    };

    // Helper function to format date from yyyy-MM-dd to dd-MM-yyyy
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    // Prepare chart data from API response
    const getChartData = () => {
        if (!borrowReturnData || !borrowReturnData.chart || borrowReturnData.chart.length === 0) {
            return {
                categories: [],
                borrow: [],
                return: []
            };
        }

        // Only use data from the API chart array, don't add extra days
        const chartArray = borrowReturnData.chart;
        return {
            categories: formatChartLabels(chartArray.map(item => item.label)),
            borrow: chartArray.map(item => item.picked_up),
            return: chartArray.map(item => item.returned)
        };
    };

    const chartData = getChartData();

    // Prepare ticket flow chart data from API response
    const getTicketFlowChartData = () => {
        if (!ticketFlowData || !ticketFlowData.chart || ticketFlowData.chart.length === 0) {
            return {
                categories: [],
                pending: [],
                approved: [],
                cancelled: []
            };
        }

        // Only use data from the API chart array, don't add extra days
        const chartArray = ticketFlowData.chart;
        return {
            categories: formatChartLabels(chartArray.map(item => item.label)),
            pending: chartArray.map(item => item.pending),
            approved: chartArray.map(item => item.approved),
            cancelled: chartArray.map(item => item.cancelled)
        };
    };

    const ticketFlowChartData = getTicketFlowChartData();

    // User Statistics Chart Config (Mock Data - Keep existing)
    const mockUserData = {
        "week": {
            categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
            data: [120, 150, 180, 200, 250, 300, 280]
        },
        "month": {
            categories: ["W1", "W2", "W3", "W4"],
            data: [500, 600, 750, 800]
        }
    };

    const userChartOptions = {
        chart: {
            height: 300,
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [{
            name: "Người dùng",
            data: mockUserData[timeRange].data
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
            categories: mockUserData[timeRange].categories,
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
                    title: `Thống kê người dùng`,
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

    // Ticket Flow Chart Config with real data
    const ticketFlowChartOptions = {
        chart: {
            height: 300,
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [
            { name: "Chờ xử lý", data: ticketFlowChartData.pending },
            { name: "Đã phê duyệt", data: ticketFlowChartData.approved },
            { name: "Đã hủy", data: ticketFlowChartData.cancelled }
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
            categories: ticketFlowChartData.categories,
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
                    title: `Thống kê luồng phiếu`,
                    mode: "light",
                    valuePrefix: "",
                    hasTextLabel: true,
                    markerClasses: "w-2.5 h-2.5 rounded-full me-2",
                    wrapperClasses: "bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md p-2",
                    titleClasses: "font-semibold text-sm mb-2 border-b border-gray-200 pb-1"
                });
            }
        },
        colors: ["#f59e0b", "#10b981", "#ef4444"]
    };

    // Borrow/Return Chart Config with real data
    const borrowReturnChartOptions = {
        chart: {
            height: 300,
            type: "area",
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        series: [
            { name: "Mượn", data: chartData.borrow },
            { name: "Trả", data: chartData.return }
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
            categories: chartData.categories,
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
                    title: `Thống kê lượt mượn - trả sách`,
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

    const getPeriodLabel = () => {
        if (timeRange === "week") return "7 ngày gần nhất";
        if (timeRange === "month") return "30 ngày gần nhất";
        return "";
    };

    return (
        <div className="w-full bg-[#F6EFE7] min-h-screen pb-10">

            {/* TITLE */}
            <h1 className="text-3xl font-semibold pt-3 mb-3 text-center text-[#4A3728]">
                Thống kê
            </h1>

            {/* TAB BUTTONS */}
            <div className="flex justify-center gap-4 mb-4">
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
                    <option value="week">7 ngày gần nhất</option>
                    <option value="month">30 ngày gần nhất</option>
                </select>
            </div>

            {/* CHARTS CONTAINER */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 px-4">

                {/* TICKET FLOW STATISTICS CHART */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-[#E2C6A6]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-[#4A3728]">Thống kê luồng phiếu ({getPeriodLabel()})</h2>
                            {ticketFlowData && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Từ {formatDate(ticketFlowData.start_date)} đến {formatDate(ticketFlowData.end_date)}
                                </p>
                            )}
                        </div>
                        {/* Legend Indicator */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                                <span className="text-sm text-gray-600">Chờ xử lý</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                                <span className="text-sm text-gray-600">Đã phê duyệt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                                <span className="text-sm text-gray-600">Đã hủy</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    {ticketFlowData && (
                        <div className="grid grid-cols-3 gap-4 p-2 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Chờ xử lý</p>
                                <p className="text-xl font-bold text-[#f59e0b]">{ticketFlowData.summary.total_pending}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Đã phê duyệt</p>
                                <p className="text-xl font-bold text-[#10b981]">{ticketFlowData.summary.total_approved}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Đã hủy</p>
                                <p className="text-xl font-bold text-[#ef4444]">{ticketFlowData.summary.total_cancelled}</p>
                            </div>
                        </div>
                    )}

                    <div id="hs-ticket-flow-chart">
                        {loading ? (
                            <div className="flex justify-center items-center h-80">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <Chart
                                options={ticketFlowChartOptions}
                                series={ticketFlowChartOptions.series}
                                type="area"
                                height={300}
                            />
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-[#E2C6A6]">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-[#4A3728]">Thống kê lượt mượn - trả sách ({getPeriodLabel()})</h2>
                            {borrowReturnData && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Từ {formatDate(borrowReturnData.start_date)} đến {formatDate(borrowReturnData.end_date)}
                                </p>
                            )}
                        </div>
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

                    {/* Summary Stats */}
                    {borrowReturnData && (
                        <div className="grid grid-cols-2 gap-4 p-2 bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Tổng mượn</p>
                                <p className="text-xl font-bold text-[#2563eb]">{borrowReturnData.summary.total_picked_up}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Tổng trả</p>
                                <p className="text-xl font-bold text-[#d946ef]">{borrowReturnData.summary.total_returned}</p>
                            </div>
                        </div>
                    )}

                    <div id="hs-multiple-area-charts-compare-two-tooltip">
                        {loading ? (
                            <div className="flex justify-center items-center h-80">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <Chart
                                options={borrowReturnChartOptions}
                                series={borrowReturnChartOptions.series}
                                type="area"
                                height={300}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
