// OtherJsonData may be stored as an object or a JSON string
export function getOtherJsonData(record) {
    const raw = record?.OtherJsonData;
    if (!raw) return {};
    if (typeof raw === "string") {
        try {
            return JSON.parse(raw) || {};
        } catch {
            return {};
        }
    }
    return { ...raw };
}
