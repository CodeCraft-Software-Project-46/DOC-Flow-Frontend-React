import { useState } from "react";
import { ChangePasswordModal } from "../../components/account/ChangePasswordModal.tsx";
import { Field } from "../../components/account/Field.tsx";

export const AccountPage = () => {

    const user = {
        username: "alice123",
        email: "alice@example.com",
        mobile: "0771234567",
        name: "Alice Cooper",
        address: "Colombo, Sri Lanka"
    };

    const [showChangeModal, setShowChangeModal] = useState(false);

    return (
        <div className="space-y-4">

            {/* Profile Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">

                <Field label="Username" value={user.username} />
                <Field label="Email" value={user.email} />
                <Field label="Mobile" value={user.mobile} />
                <Field label="Address" value={user.address} />

                {/* Password Section (ONLY BUTTON) */}
                <div>
                    <label className="text-gray-600">Password</label>

                    <button
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg"
                        onClick={() => setShowChangeModal(true)}
                    >
                        Change Password
                    </button>
                </div>

            </div>

            {/* Modal */}
            {showChangeModal && (
                <ChangePasswordModal
                    onClose={() => setShowChangeModal(false)}
                />
            )}
        </div>
    );
};