export function getCompletedAtDate(completed_at: any): Date {
    if (!completed_at) return new Date(NaN);
    // Firestore Timestamp object (has toDate)
    if (typeof completed_at === "object" && typeof completed_at.toDate === "function") {
        return completed_at.toDate();
    }
    // Firestore Timestamp object (has seconds)
    if (typeof completed_at === "object" && typeof completed_at.seconds === "number") {
        return new Date(completed_at.seconds * 1000);
    }
    // JS Date object
    if (completed_at instanceof Date) {
        return completed_at;
    }
    // String date
    return new Date(completed_at);
}