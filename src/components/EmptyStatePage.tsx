import React from "react";
import type { LucideIcon } from "lucide-react";

type EmptyStatePageProps = {
    title: string;
    icon: LucideIcon;
    description?: string;
};

export const EmptyStatePage: React.FC<EmptyStatePageProps> = ({
    title,
    icon: Icon,
    description = "This page is coming soon.",
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Icon size={26} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
};
