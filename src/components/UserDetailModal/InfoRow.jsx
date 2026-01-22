export default function InfoRow({ label, value }) {
    return (
        <div className="flex gap-4 items-center">
            <span className="font-semibold w-36 text-base">{label}:</span>
            <span className="text-base font-medium text-gray-800 wrap-break-word">{value}</span>
        </div>
    );
}