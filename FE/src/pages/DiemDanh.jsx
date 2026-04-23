import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiemDanh = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [lopChon, setLopChon] = useState('');
  
  // Mặc định lấy ngày hôm nay (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  const [ngayChon, setNgayChon] = useState(today);
  
  const [danhSachHocSinh, setDanhSachHocSinh] = useState([]);
  const [dangTai, setDangTai] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'teacher';

  useEffect(() => {
    // Nếu là Giáo viên thì gọi API lấy lớp được phân công, nếu Admin thì lấy hết
    const url = userRole === 'teacher' ? '/my-classes' : '/lophoc';
    axios.get(url)
         .then(res => setDanhSachLop(res.data.data))
         .catch(console.error);
  }, [userRole]);

  // Nút bấm "Tải Danh Sách"
  const handleTaiDanhSach = () => {
    if (!lopChon || !ngayChon) {
      Swal.fire('Chú ý', 'Vui lòng chọn Lớp và Ngày!', 'warning');
      return;
    }
    setDangTai(true);
    axios.post('/diemdanh/danhsach', { lop_hoc_id: lopChon, ngay: ngayChon })
      .then(res => {
        setDanhSachHocSinh(res.data.data);
        if(res.data.data.length === 0) {
          Swal.fire('Thông báo', 'Lớp này chưa có học sinh nào!', 'info');
        }
      })
      .catch(err => Swal.fire('Lỗi', 'Không thể tải danh sách!', 'error'))
      .finally(() => setDangTai(false));
  };

  // Thay đổi trạng thái 1 học sinh khi tick radio
  const handleChangeTrangThai = (hoc_sinh_id, trang_thai_moi) => {
    const dataMoi = danhSachHocSinh.map(hs => 
      hs.hoc_sinh_id === hoc_sinh_id ? { ...hs, trang_thai: trang_thai_moi } : hs
    );
    setDanhSachHocSinh(dataMoi);
  };

  // Nút "LƯU ĐIỂM DANH"
  const handleLuu = () => {
    if (danhSachHocSinh.length === 0) return;
    
    axios.post('/diemdanh/luu', {
      lop_hoc_id: lopChon,
      ngay: ngayChon,
      danh_sach: danhSachHocSinh
    }).then(res => {
      Swal.fire('Thành công', 'Đã lưu sổ điểm danh!', 'success');
    }).catch(err => {
      Swal.fire('Thất bại', 'Có lỗi khi lưu!', 'error');
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="text-primary fw-bold m-0">📋 SỔ ĐIỂM DANH</h2>
      </div>

      <div className="card shadow-sm border-primary mb-4">
        <div className="card-body row align-items-end">
          <div className="col-md-4 mb-3 mb-md-0">
            <label className="fw-bold text-dark mb-1">Chọn Lớp Giảng Dạy</label>
            <select className="form-select border-primary" 
                    value={lopChon} 
                    onChange={e => {setLopChon(e.target.value); setDanhSachHocSinh([]);}}>
              <option value="">-- Chọn một lớp --</option>
              {danhSachLop.map(lop => (
                <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-4 mb-3 mb-md-0">
            <label className="fw-bold text-dark mb-1">Ngày Điểm Danh</label>
            <input type="date" className="form-control border-primary" 
                   value={ngayChon} 
                   onChange={e => {setNgayChon(e.target.value); setDanhSachHocSinh([]);}} />
          </div>

          <div className="col-md-4">
            <button className="btn btn-primary w-100 fw-bold shadow-sm" onClick={handleTaiDanhSach} disabled={dangTai}>
              {dangTai ? 'Đang tải...' : '🔍 TẢI DANH SÁCH LỚP'}
            </button>
          </div>
        </div>
      </div>

      {danhSachHocSinh.length > 0 && (
        <div className="card shadow-sm border-0 animate__animated animate__fadeIn">
          <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
            <span>Danh sách điểm danh lớp ({ngayChon})</span>
            <span className="badge bg-success fs-6">Sĩ số: {danhSachHocSinh.length}</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered mb-0 text-center align-middle">
              <thead className="table-light text-dark">
                <tr>
                  <th>STT</th>
                  <th>Mã HS</th>
                  <th className="text-start">Họ Tên</th>
                  <th className="text-success">✅ Có mặt</th>
                  <th className="text-warning">⚠️ Vắng phép</th>
                  <th className="text-danger">❌ Không phép</th>
                </tr>
              </thead>
              <tbody>
                {danhSachHocSinh.map((hs, index) => (
                  <tr key={hs.hoc_sinh_id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{hs.ma_hoc_sinh}</td>
                    <td className="text-start fw-bold text-primary">{hs.ho_ten}</td>
                    
                    {/* Các nút Radio để chọn trạng thái */}
                    {['Có mặt', 'Vắng phép', 'Vắng không phép'].map(trangThai => (
                      <td key={trangThai}>
                        <input 
                          type="radio" 
                          className="form-check-input"
                          style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
                          name={`hs_${hs.hoc_sinh_id}`}
                          checked={hs.trang_thai === trangThai}
                          onChange={() => handleChangeTrangThai(hs.hoc_sinh_id, trangThai)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-white text-end py-3">
            <button className="btn btn-success btn-lg fw-bold shadow px-5" onClick={handleLuu}>
              💾 LƯU SỔ ĐIỂM DANH
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiemDanh;