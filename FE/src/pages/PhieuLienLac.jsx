import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Printer, Eye, ChevronLeft } from 'lucide-react';

const PhieuLienLac = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [selectedLop, setSelectedLop] = useState('');
  const [allHocSinh, setAllHocSinh] = useState([]); // Chứa tất cả HS
  const [danhSachHienThi, setDanhSachHienThi] = useState([]); // HS đã lọc theo lớp
  const [phieuDetail, setPhieuDetail] = useState(null);

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => {
    // 1. Tải danh sách lớp
    const apiLop = userRole === 'teacher' ? '/my-classes' : '/lophoc';
    axios.get(apiLop).then(res => setDanhSachLop(res.data.data || [])).catch(() => setDanhSachLop([]));

    // 2. Tải TẤT CẢ học sinh (Giống trang Nhập Điểm để chắc chắn có data)
    axios.get('/hocsinh').then(res => setAllHocSinh(res.data.data || [])).catch(() => setAllHocSinh([]));
  }, [userRole]);

  // Khi chọn Lớp -> Tự động lọc học sinh ở Frontend
  useEffect(() => {
    if (selectedLop && allHocSinh.length > 0) {
      const filtered = allHocSinh.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));
      setDanhSachHienThi(filtered);
    } else {
      setDanhSachHienThi([]);
    }
    setPhieuDetail(null);
  }, [selectedLop, allHocSinh]);

  const handleXemPhieu = (id) => {
    axios.get(`/phieulienlac/chitiet/${id}`)
      .then(res => setPhieuDetail(res.data.data))
      .catch(() => Swal.fire('Lỗi', 'Không thể tải dữ liệu điểm/hạnh kiểm', 'error'));
  };

  const formatDiem = (val) => (val !== null && val !== undefined && val !== '') ? val : '-';

  return (
    <div className="container-fluid mb-5">
      <div className="d-print-none">
        <h2 className="text-primary fw-bold mb-4">🖨️ XUẤT PHIẾU LIÊN LẠC</h2>
        <div className="card shadow-sm mb-4 border-primary bg-light">
          <div className="card-body">
            <div className="col-md-4">
              <label className="fw-bold text-primary mb-2">Chọn Lớp Để Xem Danh Sách</label>
              <select className="form-select border-primary fw-bold" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                <option value="">-- Vui lòng chọn lớp --</option>
                {danhSachLop?.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
              </select>
            </div>
          </div>
        </div>

        {selectedLop && danhSachHienThi.length === 0 && <div className="alert alert-danger text-center fw-bold">⚠️ Lớp này hiện chưa có học sinh nào trong hệ thống!</div>}

        {danhSachHienThi.length > 0 && !phieuDetail && (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th className="text-start ps-4">Họ và Tên Học Sinh</th>
                    <th>Ngày Sinh</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {danhSachHienThi.map(hs => (
                    <tr key={hs.id}>
                      <td className="text-start ps-4 fw-bold text-primary">{hs?.ho_ten}</td>
                      <td>{hs?.ngay_sinh}</td>
                      <td><button className="btn btn-sm btn-info text-white fw-bold px-3 shadow-sm" onClick={() => handleXemPhieu(hs.id)}><Eye size={16} className="me-1"/> Lập Phiếu</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {phieuDetail && (
        <div className="mt-2 print-container">
          <div className="d-flex justify-content-between mb-4 d-print-none">
            <button className="btn btn-secondary fw-bold shadow-sm" onClick={() => setPhieuDetail(null)}><ChevronLeft size={20}/> Quay Lại</button>
            <button className="btn btn-success fw-bold px-4 shadow" onClick={() => window.print()}><Printer size={20} className="me-2"/> IN PHIẾU NGAY (A4)</button>
          </div>

          <div className="card border-dark rounded-0 p-5 bg-white mx-auto shadow-lg" style={{ width: '210mm', minHeight: '297mm', border: '2px solid black' }}>
            {/* Header */}
            <div className="row text-center mb-4 border-bottom border-2 pb-3 border-dark">
              <div className="col-5"><h6>SỞ GIÁO DỤC VÀ ĐÀO TẠO</h6><h5 className="fw-bold text-danger">TRƯỜNG THPT CHUYÊN K49</h5></div>
              <div className="col-7"><h6>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6><h6 className="fw-bold text-decoration-underline">Độc lập - Tự do - Hạnh phúc</h6></div>
            </div>

            <div className="text-center mb-5">
              <h2 className="fw-bold">PHIẾU LIÊN LẠC HỌC KỲ I</h2>
              <p className="fst-italic">Năm học: 2025 - 2026</p>
            </div>

            {/* Thông tin HS */}
            <div className="row mb-4 fs-5">
              <div className="col-6">Họ tên: <span className="fw-bold text-uppercase">{phieuDetail?.hoc_sinh?.ho_ten}</span></div>
              <div className="col-6">Lớp: <span className="fw-bold">{phieuDetail?.hoc_sinh?.ten_lop}</span></div>
              <div className="col-6">Ngày sinh: <span className="fw-bold">{phieuDetail?.hoc_sinh?.ngay_sinh}</span></div>
              <div className="col-6">Giới tính: <span className="fw-bold">{phieuDetail?.hoc_sinh?.gioi_tinh || '-'}</span></div>
            </div>

            <h5 className="fw-bold mb-3">I. KẾT QUẢ HỌC TẬP</h5>
            <table className="table table-bordered border-dark text-center align-middle mb-4">
              <thead className="table-light border-dark">
                <tr>
                  <th style={{width: '5%'}}>STT</th>
                  <th className="text-start">Môn Học</th>
                  <th>Miệng</th>
                  <th>15p</th>
                  <th>1 Tiết</th>
                  <th>Thi HK</th>
                  <th className="fw-bold text-danger">TB Môn</th>
                </tr>
              </thead>
              <tbody>
                {phieuDetail?.diem_so?.length > 0 ? phieuDetail.diem_so.map((diem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-start fw-bold">{diem.mon_hoc?.ten_mon}</td>
                    <td>{formatDiem(diem.diem_mieng)}</td>
                    <td>{formatDiem(diem.diem_15_phut)}</td>
                    <td>{formatDiem(diem.diem_1_tiet)}</td>
                    <td>{formatDiem(diem.diem_thi)}</td>
                    <td className="fw-bold text-danger">{diem.diem_trung_binh}</td>
                  </tr>
                )) : <tr><td colSpan="7" className="py-3 text-muted">Chưa có dữ liệu điểm.</td></tr>}
                <tr className="table-secondary border-dark">
                  <td colSpan="6" className="text-end fw-bold">ĐIỂM TRUNG BÌNH HỌC KỲ:</td>
                  <td className="fw-bold text-danger fs-5">{phieuDetail?.dtb_hoc_ky}</td>
                </tr>
              </tbody>
            </table>

            <h5 className="fw-bold mb-3">II. ĐÁNH GIÁ RÈN LUYỆN</h5>
            <div className="border border-dark p-3 mb-5" style={{minHeight: '120px'}}>
              <p>Xếp loại hạnh kiểm: <span className="fw-bold text-uppercase text-primary fs-5">{phieuDetail?.hanh_kiem?.loai || 'Chưa đánh giá'}</span></p>
              <p>Nhận xét: <span className="fst-italic">{phieuDetail?.hanh_kiem?.nhan_xet || '.........................................................'}</span></p>
            </div>

            <div className="row text-center mt-auto">
              <div className="col-4"><h6>PHỤ HUYNH</h6><p className="small fst-italic">(Ký tên)</p></div>
              <div className="col-4"><h6>GIÁO VIÊN</h6><p className="small fst-italic">(Ký tên)</p></div>
              <div className="col-4"><h6>HIỆU TRƯỞNG</h6><p className="small fst-italic">(Ký, đóng dấu)</p></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; }
          .d-print-none { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PhieuLienLac;