'use client'

export default function ListOfService(){

    interface OrderItem {
        id: string;
        customer: string;
        date: string;
        status: "Completed" | "Processing" | "Cancelled";
        amount: string;
    }
    
    const recentOrders: OrderItem[] = [
        { id: "ORD-001", customer: "John Doe", date: "2023-05-20", status: "Completed", amount: "$125.00" },
        { id: "ORD-002", customer: "Jane Smith", date: "2023-05-19", status: "Processing", amount: "$75.50" },
        { id: "ORD-003", customer: "Robert Johnson", date: "2023-05-18", status: "Completed", amount: "$220.00" },
        { id: "ORD-004", customer: "Emily Davis", date: "2023-05-17", status: "Cancelled", amount: "$45.99" },
        { id: "ORD-005", customer: "Michael Brown", date: "2023-05-16", status: "Completed", amount: "$180.25" },
    ];
    return (
        <div className="w-full min-h-screen bg-stone-900 py-20 space-y-20">
            <div className="w-3/4 bg-stone-800 rounded-lg shadow-lg border border-stone-700 mx-auto">
                <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-stone-100">My Service</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-700">
                        <thead className="bg-stone-900">
                        <tr>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Order ID
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Customer
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Date
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Status
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Amount
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {recentOrders.map((order: OrderItem) => (
                            <tr
                            key={order.id}
                            className="hover:bg-stone-700 transition-colors"
                            >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "Completed"
                                    ? "bg-green-900 text-green-200"
                                    : order.status === "Processing"
                                    ? "bg-yellow-900 text-yellow-200"
                                    : "bg-red-900 text-red-200"
                                }`}
                                >
                                {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                {order.amount}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add On Service Table */}
            <div className="w-3/4 bg-stone-800 rounded-lg shadow-lg border border-stone-700 mx-auto">
                <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-stone-100">Add On Service</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-700">
                        <thead className="bg-stone-900">
                        <tr>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Order ID
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Customer
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Date
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Status
                            </th>
                            <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider"
                            >
                            Amount
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-stone-800 divide-y divide-stone-700">
                        {recentOrders.map((order: OrderItem) => (
                            <tr
                            key={order.id}
                            className="hover:bg-stone-700 transition-colors"
                            >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                                {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "Completed"
                                    ? "bg-green-900 text-green-200"
                                    : order.status === "Processing"
                                    ? "bg-yellow-900 text-yellow-200"
                                    : "bg-red-900 text-red-200"
                                }`}
                                >
                                {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-100">
                                {order.amount}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};



