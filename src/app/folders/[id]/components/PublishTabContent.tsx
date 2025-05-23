export function PublishTabContent() {
    return (
        <div className="text-sm space-y-2">
            <input
                className="w-full border rounded px-3 py-2 text-sm"
                value="https://your-page.link"
                readOnly
            />

            <div className="flex justify-between items-center py-2 ">
                <span>검색 엔진 인덱싱</span>
                <input type="checkbox" />
            </div>
        </div>
    );
}
