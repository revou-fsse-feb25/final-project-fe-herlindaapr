import AdminDashboard from "../components/AdminDashboard"

export default function AdminPage() {

    return (
        <div className="min-h-screen bg-stone-900 py-20">
            <div className="flex">
                <div className="max-w-7xl mx-auto">
                    <AdminDashboard />
                </div>
            </div>
        </div>
    )
}