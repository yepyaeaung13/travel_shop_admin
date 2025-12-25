

export function getToggleCategoryStatus (status: "active" | "inactive") {
    return status === "active" ? "inactive" : "active";
}