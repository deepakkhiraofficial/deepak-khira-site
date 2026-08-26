export function Card({ className, children }) {
    return (
        <div className={`bg-[#0d0d0d] border border-gray-800 rounded-xl p-5 ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }) {
    return <h2 className="text-xl font-bold text-white">{children}</h2>;
}

export function CardContent({ children }) {
    return <div>{children}</div>;
}
  