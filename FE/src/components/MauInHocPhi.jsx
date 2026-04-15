import React from "react";

// Đây là cái mẫu sẽ hiện ra trên tờ giấy A4
export const MauInHocPhi = React.forwardRef((props, ref) => {
  const { data } = props; // Nhận dữ liệu phiếu thu từ trang HocPhi truyền sang
if (!data) return null;
  return (
    <div ref={ref} className="p-5" style={{ minHeight: '100vh' }}>
      <div className="text-center mb-5">
        <h3 className="fw-bold">BỘ GIÁO DỤC VÀ ĐÀO TẠO</h3>
        <h4 className="fw-bold">TRƯỜNG CẤP 3 TÈO V2</h4>
        <hr />
        <h2 className="text-uppercase mt-4">BIÊN LAI THU HỌC PHÍ</h2>
        <p>Số phiếu: #HP-{data?.id}</p>
      </div>

      <div className="mt-5 fs-5">
        <p><strong>Họ tên học sinh:</strong> {data?.hoc_sinh?.ho_ten}</p>
        <p><strong>Lớp:</strong> {data?.hoc_sinh?.lop_hoc?.ten_lop}</p>
        <p><strong>Học kỳ:</strong> {data?.hoc_ki}</p>
        <p><strong>Số tiền:</strong> <span className="text-danger fw-bold">{Number(data?.so_tien).toLocaleString()} VNĐ</span></p>
        <p><strong>Trạng thái:</strong> Đã hoàn thành đóng phí</p>
        <p><strong>Ngày thu:</strong> {data?.ngay_dong}</p>
      </div>

      <div className="row mt-5 pt-5 text-center">
        <div className="col-6">
          <p className="fw-bold">Người nộp tiền</p>
          <br /><br /><br />
          <p>(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="col-6">
          <p className="fw-bold">Người thu tiền</p>
          <br /><br /><br />
          <p><strong>{data?.nguoi_thu || "Admin Tèo"}</strong></p>
        </div>
      </div>
    </div>
  );
});