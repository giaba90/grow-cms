"use client";
export function StatusBadge({
    status, isTaxonomy = false,
}: {
    status: string;
    isTaxonomy?: boolean;
}) {
    let classes = "";
    if (isTaxonomy) {
        classes =
            status === "category"
                ? "bg-green-100 text-green-800"
                : "bg-blue-300 text-blue-800";
    } else {
        classes =
            status === "published"
                ? "bg-green-100 text-green-800"
                : status === "draft"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-300 text-blue-800";
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
