import React from "react";
import clsx from "clsx";

export function Button({ className, children, ...props }) {
    return (
        <button
            className={clsx(
                "px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
