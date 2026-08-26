import React from "react";
import clsx from "clsx";

export function Input({ className, ...props }) {
    return (
        <input
            className={clsx(
                "w-full px-4 py-2 border border-gray-700 bg-black text-white rounded-lg outline-none focus:border-blue-500 transition",
                className
            )}
            {...props}
        />
    );
}
