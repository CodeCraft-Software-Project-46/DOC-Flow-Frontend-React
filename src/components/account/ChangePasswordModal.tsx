import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const ChangePasswordModal = ({
                                        onClose
                                    }: {
    onClose: () => void;
}) => {

    const [step, setStep] = useState(1);

    const [current, setCurrent] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [fieldErrors, setFieldErrors] = useState({
        current: "",
        newPassword: "",
        confirm: ""
    });

    // visibility states
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    //  Fake check (replace with API)
    const correctPassword = "1234";

    const validatePassword = (pwd: string) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(pwd);
    };

    // Live rules
    const rules = {
        length: newPassword.length >= 6,
        upper: /[A-Z]/.test(newPassword),
        lower: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
        special: /[@$!%*?&]/.test(newPassword),
    };

    // STEP 1
    const verifyCurrent = () => {
        let errors = { current: "", newPassword: "", confirm: "" };

        if (!current) {
            errors.current = "Current password is required";
        } else if (current !== correctPassword) {
            errors.current = "Incorrect current password";
        }

        setFieldErrors(errors);

        if (!errors.current) {
            setStep(2);
        }
    };

    // STEP 2
    const updatePassword = () => {
        let errors = { current: "", newPassword: "", confirm: "" };

        if (!validatePassword(newPassword)) {
            errors.newPassword =
                "Must be 6+ chars with upper, lower, number & special char";
        }

        if (!confirm) {
            errors.confirm = "Please confirm password";
        } else if (newPassword !== confirm) {
            errors.confirm = "Passwords do not match";
        }

        setFieldErrors(errors);

        if (!errors.newPassword && !errors.confirm) {
            alert("Password updated successfully!");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 relative">

                {/* Close */}
                <button
                    className="absolute top-2 right-2 text-gray-500"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold mb-4">
                    Change Password
                </h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter current password"
                                value={current}
                                onChange={(e) => {
                                    setCurrent(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, current: "" }));
                                }}
                                className={`w-full border px-3 py-2 rounded pr-10 ${
                                    fieldErrors.current ? "border-red-500" : ""
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {fieldErrors.current && (
                            <p className="text-red-500 text-xs mt-1">
                                {fieldErrors.current}
                            </p>
                        )}

                        <button
                            className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
                            onClick={verifyCurrent}
                        >
                            Verify
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        {/* New Password */}
                        <div className="relative mb-1">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, newPassword: "" }));
                                }}
                                className={`w-full border px-3 py-2 rounded pr-10 ${
                                    fieldErrors.newPassword ? "border-red-500" : ""
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {fieldErrors.newPassword && (
                            <p className="text-red-500 text-xs mb-1">
                                {fieldErrors.newPassword}
                            </p>
                        )}

                        {/* Live Rules */}
                        <ul className="text-xs mb-2 space-y-1">
                            <li className={rules.length ? "text-green-600" : "text-gray-500"}>
                                ✔ At least 6 characters
                            </li>
                            <li className={rules.upper ? "text-green-600" : "text-gray-500"}>
                                ✔ Uppercase letter
                            </li>
                            <li className={rules.lower ? "text-green-600" : "text-gray-500"}>
                                ✔ Lowercase letter
                            </li>
                            <li className={rules.number ? "text-green-600" : "text-gray-500"}>
                                ✔ Number
                            </li>
                            <li className={rules.special ? "text-green-600" : "text-gray-500"}>
                                ✔ Special character
                            </li>
                        </ul>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirm}
                                onChange={(e) => {
                                    setConfirm(e.target.value);
                                    setFieldErrors(prev => ({ ...prev, confirm: "" }));
                                }}
                                className={`w-full border px-3 py-2 rounded pr-10 ${
                                    fieldErrors.confirm ? "border-red-500" : ""
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {fieldErrors.confirm && (
                            <p className="text-red-500 text-xs mt-1">
                                {fieldErrors.confirm}
                            </p>
                        )}

                        <button
                            className="mt-3 w-full bg-green-500 text-white py-2 rounded"
                            onClick={updatePassword}
                        >
                            Update Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};