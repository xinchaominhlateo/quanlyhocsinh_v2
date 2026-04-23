import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PhieuLienLac = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [selectedLop, setSelectedLop] = useState('');
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [phieuDetail, setPhieuDetail] = useState(null);

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => {
    // Phân quyền tải danh sách Lớp
    const api = userRole === 'teacher' ? '/my-classes' : '/lophoc';
    axios.get(api).then(res => setDanhSachLop(res.data.data)).catch(err => console.log(err));
  }, [userRole]);

  useEffect(() => {
    // Khi chọn Lớp -> Tải học sinh của lớp đó
    if (selectedLop) {
      axios.get(`/phieulienlac/lop/${selectedLop}`)
        .then(res => setDanhSachHS(res.data.data))
        .catch(err => console.log(err));
      setPhieuDetail(null); 
    }
  }, [selectedLop]);

  // Nút bấm tải dữ liệu Chi Tiết
  const handleXemPhieu = (id) => {
    axios.get(`/phieulienlac/chitiet/${id}`)
      .then(res => setPhieuDetail(res.data.data))
      .catch(() => Swal.fire('Lỗi', 'Không thể tải phiếu liên lạc', 'error'));
  };

  // Nút gọi lệnh In của Trình duyệt
  const handleInPhieu = () => {
    window.print();
  };

  return (
    <div className="container-fluid mb-5">
      
      {/* ========================================== */}
      {/* KHU VỰC CHỌN LỚP & HỌC SINH (BỊ ẨN KHI IN) */}
      {/* ========================================== */}
      <div className="d-print-none">
        <h2 className="text-primary fw-bold mb-4">🖨️ XUẤT PHIẾU LIÊN LẠC</h2>
        
        <div className="card shadow-sm mb-4 border-primary">
          <div className="card-body bg-light">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="fw-bold text-primary mb-2">1. Chọn Lớp Học</label>
                <select className="form-select border-primary fw-bold" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                  <option value="">-- Vui lòng chọn lớp --</option>
                  {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {selectedLop && danhSachHS.length === 0 && (
          <div className="alert alert-warning text-center fw-bold">Lớp này hiện chưa có học sinh nào!</div>
        )}

        {danhSachHS.length > 0 && !phieuDetail && (
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">2. Danh Sách Học Sinh</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start px-4">Họ Tên</th>
                      <th>Ngày Sinh</th>
                      <th>Giới Tính</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {danhSachHS.map(hs => (
                      <tr key={hs.id}>
                        <td className="text-start fw-bold text-primary px-4">{hs.ho_ten}</td>
                        <td>{hs.ngay_sinh}</td>
                        <td>{hs.gioi_tinh || '-'}</td>
                        <td>
                          <button className="btn btn-sm btn-info text-white fw-bold px-3 shadow-sm" onClick={() => handleXemPhieu(hs.id)}>
                            👁️ Lập Phiếu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* KHU VỰC FORM A4 IN PHIẾU LIÊN LẠC (HIỂN THỊ KHI XEM PHIẾU)*/}
      {/* ========================================================= */}
      {phieuDetail && (
        <div className="mt-4 print-container">
          
          <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
            <button className="btn btn-secondary fw-bold" onClick={() => setPhieuDetail(null)}>⬅ Chọn Học Sinh Khác</button>
            <button className="btn btn-success fw-bold px-5 shadow fs-5" onClick={handleInPhieu}>🖨️ XUẤT RA MÁY IN</button>
          </div>

          <div className="card border-2 border-dark rounded-0 p-5 bg-white shadow" style={{ minHeight: '900px' }}>
            
            {/* Header Quốc Hiệu */}
            <div className="row text-center mb-5 border-bottom border-2 pb-3 border-dark">
              <div className="col-5">
                <h6 className="fw-bold m-0">SỞ GIÁO DỤC VÀ ĐÀO TẠO</h6>
                <h5 className="fw-bold text-danger m-0 mt-1">TRƯỜNG THPT CHUYÊN K49</h5>
              </div>
              <div className="col-7">
                <h6 className="fw-bold m-0">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
                <h6 className="fw-bold text-decoration-underline m-0">Độc lập - Tự do - Hạnh phúc</h6>
              </div>
            </div>

            {/* Tiêu đề */}
            <div className="text-center mb-5">
              <h2 className="fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>PHIẾU LIÊN LẠC HỌC KỲ I</h2>
              <p className="fst-italic text-muted fs-5">Năm học: 2025 - 2026</p>
            </div>

            {/* Thông tin học sinh */}
            <div className="mb-5">
              <div className="row fs-5 g-3">
                <div className="col-6"><p className="m-0">Họ và tên học sinh: <span className="fw-bold ms-2 text-uppercase">{phieuDetail.hoc_sinh.ho_ten}</span></p></div>
                <div className="col-6"><p className="m-0">Lớp: <span className="fw-bold ms-2">{phieuDetail.hoc_sinh.ten_lop}</span></p></div>
                <div className="col-6"><p className="m-0">Ngày sinh: <span className="fw-bold ms-2">{phieuDetail.hoc_sinh.ngay_sinh}</span></p></div>
                <div className="col-6"><p className="m-0">Giới tính: <span className="fw-bold ms-2">{phieuDetail.hoc_sinh.gioi_tinh || '-'}</span></p></div>
              </div>
            </div>

            {/* Bảng Điểm */}
            <h5 className="fw-bold mb-3 fs-5">I. KẾT QUẢ HỌC TẬP</h5>
            <table className="table table-bordered border-dark text-center align-middle mb-5">
              <thead className="table-light border-dark">
                <tr>
                  <th style={{ width: '5%' }}>STT</th>
                  <th className="text-start" style={{ width: '25%' }}>Môn Học</th>
                  <th>Điểm Miệng</th>
                  <th>15 Phút</th>
                  <th>1 Tiết</th>
                  <th>Điểm Thi HK</th>
                  <th className="fw-bold text-danger" style={{ width: '15%' }}>Trung Bình Môn</th>
                </tr>
              </thead>
              <tbody>
                {phieuDetail.diem_so.length > 0 ? phieuDetail.diem_so.map((diem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-start fw-bold">{diem.mon_hoc?.ten_mon}</td>
                    <td>{diem.diem_mieng || '-'}</td>
                    <td>{diem.diem_15_phut || '-'}</td>
                    <td>{diem.diem_1_tiet || '-'}</td>
                    <td>{diem.diem_thi || '-'}</td>
                    <td className="fw-bold text-danger fs-5">{diem.diem_trung_binh || '-'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="py-4 text-muted fst-italic">Giáo viên chưa nhập điểm cho học sinh này.</td></tr>
                )}
                
                {/* Dòng tổng kết */}
                <tr className="table-secondary border-dark">
                  <td colSpan="6" className="text-end fw-bold text-uppercase pe-3 py-3 fs-5">ĐIỂM TRUNG BÌNH CHUNG HỌC KỲ:</td>
                  <td className="fw-bold text-danger fs-4 py-3">{phieuDetail.dtb_hoc_ky}</td>
                </tr>
              </tbody>
            </table>

            {/* Hạnh kiểm */}
            <h5 className="fw-bold mb-3 fs-5">II. KẾT QUẢ RÈN LUYỆN & NHẬN XÉT</h5>
            <div className="border border-dark p-4 mb-5" style={{ minHeight: '150px' }}>
              <p className="fs-5 mb-3">
                1. Xếp loại hạnh kiểm: <span className="fw-bold ms-2 text-uppercase fs-4 text-primary">{phieuDetail.hanh_kiem?.loai || 'Chưa đánh giá'}</span>
              </p>
              <p className="fs-5 m-0">
                2. Nhận xét của Giáo viên: <span className="fst-italic ms-2">{phieuDetail.hanh_kiem?.nhan_xet || '....................................................................................................................'}</span>
              </p>
            </div>

            {/* Chữ ký */}
            <div className="row text-center mt-5 pt-4">
              <div className="col-4">
                <h6 className="fw-bold fs-5">Ý KIẾN PHỤ HUYNH</h6>
                <p className="fst-italic text-muted">(Ký và ghi rõ họ tên)</p>
              </div>
              <div className="col-4">
                <h6 className="fw-bold fs-5">GIÁO VIÊN CHỦ NHIỆM</h6>
                <p className="fst-italic text-muted">(Ký và ghi rõ họ tên)</p>
              </div>
              <div className="col-4">
                <h6 className="fw-bold fs-5">KT. HIỆU TRƯỞNG</h6>
                <p className="fst-italic text-muted">(Ký, đóng dấu)</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🛑 CSS "TÀNG HÌNH" DÀNH CHO LÚC BẤM IN 🛑 */}
      <style>{`
        @media print {
          /* Ẩn tất cả mọi thứ trên web */
          body * { visibility: hidden; }
          
          /* Chỉ hiện vùng có class print-container */
          .print-container, .print-container * { visibility: visible; }
          
          /* Đẩy cái form in lên góc trên cùng bên trái của tờ giấy A4 */
          .print-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
          }
          
          /* Ẩn các nút bấm Quay lại / In Phiếu để in ra giấy không bị dính */
          .d-print-none { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PhieuLienLac;