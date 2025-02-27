export default function VoucherUI() {
    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Tìm voucher"
                        className="p-2 border rounded-md w-1/3"
                    />
                    
                    {/* Bộ lọc ngày bắt đầu */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="p-2 border rounded-md"
                            placeholder="Ngày bắt đầu"
                        />
                    </div>

                    {/* Bộ lọc ngày kết thúc */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            className="p-2 border rounded-md" placeholder="Ngày kết thúc"
                        />
                    </div>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md">+ Tạo voucher</button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-3">STT</th>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Giá trị</th>
                                <th className="p-3">Điều Kiện</th>
                                <th className="p-3">Số Lượng</th>
                                <th className="p-3">Thời Gian</th>
                                <th className="p-3">Trạng Thái</th>
                                <th className="p-3">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Dữ liệu sẽ được thêm vào đây */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}