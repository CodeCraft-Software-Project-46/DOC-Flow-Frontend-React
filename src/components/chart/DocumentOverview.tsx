export default function DocumentOverview() {
    return (
        <div className="h-full bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold">📄 Document Overview</h3>

            <div className="mt-4 space-y-2 text-sm">
                <div>Total Documents: 240</div>
                <div>Approved: 180</div>
                <div>Pending: 40</div>
                <div>Rejected: 20</div>
            </div>
        </div>
    );
}