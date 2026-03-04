export interface Notification {
    msg: string;
    time: string;
    type: "info" | "warning" | "alert";
}

export const NOTIFICATIONS: Notification[] = [
    { msg: "New task assigned: PO-2024-0125 needs your review", time: "2/22/2026, 9:51 AM", type: "info"    },
    { msg: "SLA Warning: CONTRACT-2024-008 due in 12 hours",    time: "2/22/2026, 8:51 AM", type: "warning" },
    { msg: "INV-ACME-2024-002 approved by Finance",             time: "2/22/2026, 7:30 AM", type: "info"    },
    { msg: "EXP-2024-045 draft not submitted yet",              time: "2/22/2026, 6:00 AM", type: "alert"   },
];

export const ALERT_NOTIFICATIONS: Notification[] = NOTIFICATIONS.filter(
    (n) => n.type === "warning" || n.type === "alert"
);