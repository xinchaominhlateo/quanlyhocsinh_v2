import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LopHoc = () => {
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  // 1. Cấu trúc form mới: Chia nhỏ thành các bộ chọn
  const [chonKhoi, setChonKhoi] = useState('10');
  const [chonKyTu, setChonKyTu] = useState('A');
  const [chonSo, setChonSo] = useState('1');

  useEffect(() => { layDanhSach() }, []);

  const layDanhSach = () => {
    axios.get('/lophoc')
      .then(res => setDanhSachLop(res.data.data))
      .catch(err => console.error(err));
  };

  // 2. Tự động tính toán Tên Lớp mỗi khi m thay đổi các lựa chọn
  const tenLopTuDong = `${chonKhoi}${chonKyTu}${chonSo}`;

  const handleLuu = (e) => {
    e.preventDefault();
    
    // Dữ liệu gửi lên server sẽ bao gồm Tên lớp (ghép lại) và Khối
    const dataGuiDi = {
      ten_lop: tenLopTuDong,
      khoi: chonKhoi
    };

    if (idDangSua) {
      axios.put(`/lophoc/${idDangSua}`, dataGuiDi)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật lớp ' + tenLopTuDong, timer: 1500, showConfirmButton: false });
          layDanhSach(); resetForm();
        })
        .catch(() => Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Lớp này đã tồn tại!' }));
    } else {
      axios.post('/lophoc', dataGuiDi)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Tuyệt vời!', text: 'Đã tạo lớp ' + tenLopTuDong, timer: 1500, showConfirmButton: false });
          layDanhSach(); resetForm();
        })
        .catch(() => Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Lớp ' + tenLopTuDong + ' đã có trong hệ thống!' }));
    }
  };

  const handleChonSua = (lop) => {
    setIdDangSua(lop.id);
    // Tách tên lớp cũ ra để đưa ngược vào các ô chọn (Ví dụ: "11B2" -> 11, B, 2)
    const match = lop.ten_lop.match(/^(\d+)([A-Z]+)(\d+)$/);
    if (match) {
      setChonKhoi(match[1]);
      setChonKyTu(match[2]);
      setChonSo(match[3]);
    }
    setHienThiForm(true);
  };

  const resetForm = () => {
    setChonKhoi('10'); setChonKyTu('A'); setChonSo('1');
    setIdDangSua(null); setHienThiForm(false);
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa lớp học?', text: "Dữ liệu sẽ không thể khôi phục!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/lophoc/${id}`).then(() => { layDanhSach(); Swal.fire('Đã xóa!', '', 'success') });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🏫 QUẢN LÝ LỚP HỌC</h2>
        <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
          {hienThiForm ? "❌ Đóng" : "+ Tạo Lớp Mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className="card-body">
            <h5 className="fw-bold mb-3 text-muted">Chọn cấu trúc tên lớp:</h5>
            <form onSubmit={handleLuu} className="row align-items-end">
              
              {/* BỘ CHỌN 1: KHỐI */}
              <div className="col-md-3 mb-3">
                <label className="fw-bold"> Chọn Khối</label>
                <select className="form-select border-primary fw-bold" value={chonKhoi} onChange={(e) => setChonKhoi(e.target.value)}>
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>

              {/* BỘ CHỌN 2: KÝ TỰ LỚP */}
              <div className="col-md-3 mb-3">
                <label className="fw-bold"> Phân loại </label>
                <select className="form-select border-primary fw-bold" value={chonKyTu} onChange={(e) => setChonKyTu(e.target.value)}>
                  {['A', 'B', 'C', 'D', 'E', 'T', 'K',].map(char => (
                    <option key={char} value={char}>Lớp {char}</option>
                  ))}
                </select>
              </div>

              {/* BỘ CHỌN 3: SỐ THỨ TỰ */}
              <div className="col-md-3 mb-3">
                <label className="fw-bold"> Số thứ tự</label>
                <select className="form-select border-primary fw-bold" value={chonSo} onChange={(e) => setChonSo(e.target.value)}>
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>Số {i+1}</option>
                  ))}
                </select>
              </div>

              {/* HIỂN THỊ KẾT QUẢ GHÉP TÊN */}
              <div className="col-md-3 mb-3 text-center">
                <label className="d-block fw-bold text-muted">Tên lớp sẽ tạo:</label>
                <h2 className="text-danger fw-bold">{tenLopTuDong}</h2>
              </div>

              <div className="col-12 text-end mt-2">
                <button type="submit" className={`btn fw-bold px-5 btn-${idDangSua ? 'warning' : 'primary'}`}>
                  {idDangSua ? '💾 Cập Nhật' : '🚀 Tạo Lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <input type="text" className="form-control border-primary mb-3" placeholder="🔍 Tìm nhanh tên lớp hoặc mã lớp..." value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
      
      <div className="card shadow-sm border-0">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Mã Lớp</th>
              <th>Tên Lớp</th>
              <th className="text-center">Khối</th>
              <th className="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {danhSachLop.filter(l => l.ten_lop.includes(tuKhoa) || l.ma_lop.includes(tuKhoa)).map((lop) => (
              <tr key={lop.id} className="align-middle">
                <td className="text-center">{lop.id}</td>
                <td className="text-center fw-bold text-muted">{lop.ma_lop}</td>
                <td className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>{lop.ten_lop}</td>
                <td className="text-center">
                  <span className="badge bg-info text-dark px-3">Khối {lop.khoi}</span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(lop)}>Sửa</button>
                  <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(lop.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LopHoc;