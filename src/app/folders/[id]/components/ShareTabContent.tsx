export function ShareTabContent() {
    return (
        <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-2">
                <span>편집 허용</span>
                <input type="checkbox" />
            </div>
            <div className="border rounded p-2 flex justify-between items-center">


                <span>초대 링크</span>
                <button className="text-blue-600 text-sm">복사</button>
            </div>


        </div>
    );
}
