import { FunctionDeclaration, Type } from "@google/genai";

export const thucHienTraCuuDiaChiMoi = async (diaChiCu: string): Promise<{ diaChiMoi: string; ghiChu: string }> => {
    console.log(`Calling external API to convert address: ${diaChiCu}`);
    const encodedAddress = encodeURIComponent(diaChiCu);
    const apiUrl = `https://don-vi-hanh-chinh.vercel.app/api/convert?address=${encodedAddress}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            let errorMsg = `Lỗi từ máy chủ API với mã trạng thái: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.error) {
                    errorMsg = `Lỗi API: ${errorData.error}`;
                }
            } catch (jsonError) {
            }
            return { diaChiMoi: 'Không thể tra cứu', ghiChu: errorMsg };
        }

        const data = await response.json();

        if (!data.success || !data.suggestions || data.suggestions.length === 0) {
            const ghiChu = data.error || 'Không tìm thấy thông tin sáp nhập cho địa chỉ này trong hệ thống.';
            return { diaChiMoi: 'Không tìm thấy', ghiChu: ghiChu };
        }

        const suggestion = data.suggestions[0];
        const newAddress = suggestion.newAddress;
        const oldUnits = suggestion.oldUnits.join(', ');

        return {
            diaChiMoi: newAddress,
            ghiChu: `Được sáp nhập từ các đơn vị: ${oldUnits}.`
        };

    } catch (error) {
        console.error("Network error or other issue calling the conversion API:", error);
        return {
            diaChiMoi: 'Lỗi kết nối',
            ghiChu: 'Không thể kết nối đến dịch vụ tra cứu địa chỉ. Vui lòng kiểm tra kết nối mạng.'
        };
    }
};

export const tools: FunctionDeclaration[] = [{
    name: 'traCuuDiaChiMoi',
    description: 'Tra cứu địa chỉ mới của một xã, phường, hoặc thị trấn sau khi được sáp nhập. Dùng cho các câu hỏi như "xã A giờ là gì?", "địa chỉ mới của thị trấn B là gì?".',
    parameters: {
        type: Type.OBJECT,
        properties: {
            diaChiCu: {
                type: Type.STRING,
                description: 'Tên đầy đủ của đơn vị hành chính cũ cần tra cứu, ví dụ: "xã Hưng Hà" hoặc "Quận 10".'
            }
        },
        required: ['diaChiCu']
    }
}];