"use client";

import React from "react";

interface CardStatsProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}

export default function CardStats({
    title,
    value,
    icon,
}: CardStatsProps) {
    return (
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>
                </div>

                {icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}