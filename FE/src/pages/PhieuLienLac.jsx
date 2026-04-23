import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Printer } from 'lucide-react';

const PhieuLienLac = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopChon, setLopChon] = useState('');
  const [danhSachHocSinh, setDanhSachHocSinh] = useState([]);
  
  // Lưu dữ liệu của học sinh đang được chọn để in
  const [chiTietPhieu, setChiTietPhieu] = useState(null);

  const userRole = localStorage.getItem('userRole') || 'teacher';

  // Lấy danh sách lớp khi mới vào trang
  useEffect(() => {
    const url = userRole === 'teacher' ? '/my-classes' : '/lophoc';
    axios.get(url).then(res => setDanhSachLop(res.data.data)).catch(console.error);
  }, [userRole]);

  // Khi đổi lớp -> Tải danh sách học sinh của lớp đó
  useEffect(() => {
    if (lopChon) {
      axios.get(`/phieulienlac/lop/${lopChon}`)
        .then(res => setDanhSachHocSinh(res.data.data))
        .catch(() => setDanhSachHocSinh([]));
    } else {
      setDanhSachHocSinh([]);
    }
  }, [lopChon]);

  // Khi bấm nút "Xem Phiếu"
  const handleXemPhieu = (id) => {
    axios.get(`/phieulienlac/chitiet/${id}`)
      .then(res => setChiTietPhieu(res.data.data))
      .catch(() => Swal.fire('Lỗi', 'Không thể lấy dữ liệu phiếu liên lạc', 'error'));
  };

  // Lệnh gọi máy in của trình duyệt
  const handleIn = () => {
    window.print();
  };

  return (
    <div className="container-fluid mb-5 phieu-lien-lac-container">
      {/* KHU VỰC ĐIỀU KHIỂN (Sẽ bị ẩn đi khi in) */}
      <div className="no-print">
        <h2 className="text-primary fw-bold mb-4">🖨️ IN PHIẾU LIÊN LẠC</h2>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body row align-items-center">
            <div className="col-md-4">
              <label className="fw-bold mb-2">Chọn lớp để lấy danh sách:</label>
              <select className="form-select border-primary" value={lopChon} onChange={e => setLopChon(e.target.value)}>
                <option value="">-- Chọn một lớp --</option>
                {danhSachLop.map(lop => (
                  <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-5">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white fw-bold">Danh Sách Học Sinh</div>
              <ul className="list-group list-group-flush" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {danhSachHocSinh.length > 0 ? danhSachHocSinh.map(hs => (
                  <li key={hs.id} className="list-group-item d-flex justify-content-between align-items-center hover-bg-light">
                    <span><strong>{hs.ma_hoc_sinh}</strong> - {hs.ho_ten}</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleXemPhieu(hs.id)}>
                      Xem Phiếu
                    </button>
                  </li>
                )) : (
                  <li className="list-group-item text-muted text-center py-4">Chưa có dữ liệu học sinh</li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-md-7">
            {!chiTietPhieu ? (
              <div className="alert alert-info text-center py-5 shadow-sm">
                👈 Hãy chọn "Xem Phiếu" một học sinh bên danh sách để xem trước bản in.
              </div>
            ) : (
              <div className="text-end mb-3">
                <button className="btn btn-success fw-bold px-4 shadow" onClick={handleIn}>
                  <Printer className="me-2" size={20} /> IN PHIẾU NÀY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KHU VỰC BẢN IN (Chỉ hiển thị đẹp khi có dữ liệu và lúc in) */}
      {chiTietPhieu && (
        <div className="printable-area border p-5 bg-white shadow mt-4 mt-md-0" style={{ minHeight: '800px' }}>
          {/* Tiêu đề Quốc hiệu */}
          <div className="text-center mb-4">
            <h5 className="fw-bold m-0">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
            <h6 className="fw-bold text-decoration-underline">Độc lập - Tự do - Hạnh phúc</h6>
          </div>
          
          <div className="text-center mb-5">
            <h3 className="fw-bold text-uppercase">PHIẾU LIÊN LẠC HỌC TẬP</h3>
            <p className="fst-italic m-0">Năm học: 2025 - 2026</p>
          </div>

          {/* Thông tin học sinh */}
          <div className="mb-4">
            <p className="fs-5 m-1">Họ và tên học sinh: <span className="fw-bold">{chiTietPhieu.hoc_sinh.ho_ten}</span></p>
            <p className="fs-5 m-1">Mã học sinh: <strong>{chiTietPhieu.hoc_sinh.ma_hoc_sinh}</strong></p>
            <p className="fs-5 m-1">Lớp: <strong>{chiTietPhieu.hoc_sinh.lop_hoc?.ten_lop || 'Chưa xếp lớp'}</strong></p>
          </div>

          {/* Bảng Điểm */}
          <h5 className="fw-bold mt-4">I. KẾT QUẢ HỌC TẬP</h5>
          <table className="table table-bordered border-dark text-center align-middle mt-2">
            <thead className="table-light border-dark">
              <tr>
                <th>STT</th>
                <th>Môn Học</th>
                <th>Điểm Miệng</th>
                <th>Điểm 15 Phút</th>
                <th>Điểm 1 Tiết</th>
                <th>Điểm Học Kỳ</th>
                <th>Trung Bình</th>
              </tr>
            </thead>
            <tbody>
              {chiTietPhieu.diem_so.length > 0 ? chiTietPhieu.diem_so.map((diem, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="text-start fw-bold">{diem.mon_hoc?.ten_mon}</td>
                  <td>{diem.diem_mieng ?? '-'}</td>
                  <td>{diem.diem_15p ?? '-'}</td>
                  <td>{diem.diem_1tiet ?? '-'}</td>
                  <td>{diem.diem_hocky ?? '-'}</td>
                  <td className="fw-bold text-danger">{diem.diem_trungbinh ?? '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="py-3">Chưa có dữ liệu điểm.</td></tr>
              )}
            </tbody>
          </table>

          {/* Bảng Hạnh Kiểm */}
          <h5 className="fw-bold mt-4">II. ĐÁNH GIÁ HẠNH KIỂM</h5>
          <table className="table table-bordered border-dark text-center align-middle mt-2">
            <thead className="table-light border-dark">
              <tr>
                <th>Học Kỳ</th>
                <th>Xếp Loại</th>
                <th className="text-start">Nhận Xét Của Giáo Viên</th>
              </tr>
            </thead>
            <tbody>
              {chiTietPhieu.hanh_kiem.length > 0 ? chiTietPhieu.hanh_kiem.map((hk, i) => (
                <tr key={i}>
                  <td>Học kỳ {hk.hoc_ki}</td>
                  <td className="fw-bold">{hk.loai}</td>
                  <td className="text-start">{hk.nhan_xet || 'Không có nhận xét'}</td>
                </tr>
              )) : (
                <tr><td colSpan="3" className="py-3">Chưa có dữ liệu hạnh kiểm.</td></tr>
              )}
            </tbody>
          </table>

          {/* Chữ ký */}
          <div className="row mt-5 pt-4 text-center">
            <div className="col-6">
              <h6 className="fw-bold">Ý KIẾN PHỤ HUYNH</h6>
              <p className="fst-italic text-muted">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="col-6">
              <h6 className="fw-bold">GIÁO VIÊN CHỦ NHIỆM</h6>
              <p className="fst-italic text-muted">(Ký và ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS Dành Riêng Cho Máy In */}
      <style>{`
        @media print {
          /* Ẩn Sidebar, Header, Nút bấm và cảnh báo */
          .no-print, .sidebar, nav, header, footer { display: none !important; }
          
          /* Cho khu vực bản in full màn hình giấy */
          .printable-area {
            border: none !important;
            box-shadow: none !important;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Căn lại body để không bị dính lề của React */
          body { padding: 0; margin: 0; background-color: white; }
          .container-fluid { padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default PhieuLienLac;