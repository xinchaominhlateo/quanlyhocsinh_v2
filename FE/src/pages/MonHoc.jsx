import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MonHoc = () => {
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [tuKhoa, setTuKhoa] = useState('');

  // 1. Danh sách môn học chuẩn và số tiết mặc định (Tèo có thể sửa số tiết ở đây)
  const danhMucMonChuan = [
    { ten: 'Toán học', tiet: 105 },
    { ten: 'Ngữ văn', tiet: 105 },
    { ten: 'Tiếng Anh', tiet: 105 },
    { ten: 'Vật lý', tiet: 70 },
    { ten: 'Hóa học', tiet: 70 },
    { ten: 'Sinh học', tiet: 70 },
    { ten: 'Lịch sử', tiet: 52 },
    { ten: 'Địa lý', tiet: 52 },
    { ten: 'Tin học', tiet: 35 },
    { ten: 'Công nghệ', tiet: 35 },
    { ten: 'Giáo dục công dân', tiet: 35 },
    { ten: 'Giáo dục thể chất', tiet: 70 },
    { ten: 'Quốc phòng và An ninh', tiet: 35 },
  ];

  const [formDuLieu, setFormDuLieu] = useState({ ten_mon: '', so_tiet: '' });

  useEffect(() => { layDanhSach() }, []);

  const layDanhSach = () => {
    axios.get('/monhoc')
      .then(res => setDanhSachMon(res.data.data))
      .catch(err => console.error(err));
  };

  // 2. Hàm xử lý khi chọn môn: Tự động điền số tiết
  const handleChonDanhMuc = (e) => {
    const monTimThay = danhMucMonChuan.find(m => m.ten === e.target.value);
    if (monTimThay) {
      setFormDuLieu({
        ten_mon: monTimThay.ten,
        so_tiet: monTimThay.tiet
      });
    } else {
      setFormDuLieu({ ten_mon: '', so_tiet: '' });
    }
  };

const handleLuu = (e) => {
    e.preventDefault();

    if (!formDuLieu.ten_mon) {
      Swal.fire('Nhắc nhở', 'Vui lòng chọn một môn học từ danh sách!', 'warning');
      return;
    }

    if (idDangSua) {
      axios.put(`/monhoc/${idDangSua}`, formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Đã cập nhật môn ' + formDuLieu.ten_mon, timer: 1500, showConfirmButton: false });
          layDanhSach(); resetForm();
        })
        .catch(error => {
          // HIỆN LỖI THỰC TẾ TỪ SERVER
          const msg = error.response?.data?.message || 'Lỗi cập nhật hệ thống!';
          Swal.fire({ icon: 'error', title: 'Lỗi!', text: msg });
        });
    } else {
      axios.post('/monhoc', formDuLieu)
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Tuyệt vời!', text: 'Đã thêm môn ' + formDuLieu.ten_mon, timer: 1500, showConfirmButton: false });
          layDanhSach(); resetForm();
        })
        .catch(error => {
          // HIỆN LỖI THỰC TẾ TỪ SERVER
          const msg = error.response?.data?.message || 'Lỗi thêm mới (Kiểm tra lại Backend)!';
          Swal.fire({ icon: 'error', title: 'Lỗi!', text: msg });
          console.log(error.response?.data); // Xem chi tiết ở console F12
        });
    }
  };
  const handleChonSua = (mon) => {
    setIdDangSua(mon.id);
    setFormDuLieu({ ten_mon: mon.ten_mon, so_tiet: mon.so_tiet });
    setHienThiForm(true);
  };

  const resetForm = () => {
    setFormDuLieu({ ten_mon: '', so_tiet: '' });
    setIdDangSua(null); setHienThiForm(false);
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa môn học?', text: "Dữ liệu điểm số liên quan sẽ bị ảnh hưởng!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Xóa!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/monhoc/${id}`).then(() => { layDanhSach(); Swal.fire('Đã xóa!', '', 'success') });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">📚 QUẢN LÝ MÔN HỌC</h2>
        <button className={`btn fw-bold shadow-sm ${hienThiForm ? 'btn-secondary' : 'btn-success'}`} onClick={() => hienThiForm ? resetForm() : setHienThiForm(true)}>
          {hienThiForm ? "❌ Đóng Form" : "+ Thêm Môn Mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'success'}`}>
          <div className="card-body">
            <form onSubmit={handleLuu} className="row align-items-end">
              <div className="col-md-5 mb-3">
                <label className="fw-bold"> Chọn Môn Học</label>
                <select 
                  className="form-select border-primary fw-bold" 
                  value={formDuLieu.ten_mon} 
                  onChange={handleChonDanhMuc}
                  required
                >
                  <option value="">-- Chọn môn từ danh mục --</option>
                  {danhMucMonChuan.map((m, index) => (
                    <option key={index} value={m.ten}>{m.ten}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="fw-bold"> Số tiết </label>
                <input 
                  type="text" 
                  className="form-control bg-light fw-bold text-center text-danger" 
                  value={formDuLieu.so_tiet ? formDuLieu.so_tiet + ' tiết' : ''} 
                  readOnly 
                  placeholder="Chọn môn để hiện số tiết..."
                />
              </div>

              <div className="col-md-3 mb-3">
                <button type="submit" className={`btn w-100 fw-bold btn-${idDangSua ? 'warning' : 'primary'}`}>
                  {idDangSua ? '💾 Cập Nhật' : '🚀 Thêm Môn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-3">
        <input 
          type="text" 
          className="form-control border-primary" 
          placeholder="🔍 Tìm nhanh môn học hoặc mã môn..." 
          value={tuKhoa} 
          onChange={(e) => setTuKhoa(e.target.value)} 
        />
      </div>
      
      <div className="card shadow-sm border-0">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Mã Môn</th>
              <th>Tên Môn Học</th>
              <th className="text-center">Số Tiết</th>
              <th className="text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {danhSachMon.filter(m => m.ten_mon.toLowerCase().includes(tuKhoa.toLowerCase()) || m.ma_mon.toLowerCase().includes(tuKhoa.toLowerCase())).map((mon) => (
              <tr key={mon.id} className="align-middle">
                <td className="text-center">{mon.id}</td>
                <td className="text-center fw-bold text-muted">{mon.ma_mon}</td>
                <td className="fw-bold text-primary">{mon.ten_mon}</td>
                <td className="text-center">{mon.so_tiet} tiết</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-warning me-2 fw-bold" onClick={() => handleChonSua(mon)}>Sửa</button>
                  <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(mon.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonHoc;