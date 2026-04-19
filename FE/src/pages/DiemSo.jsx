import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiemSo = () => {
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [idDangSua, setIdDangSua] = useState(null); // Thêm cái này để biết đang sửa dòng nào
  
  const [form, setForm] = useState({ 
    hoc_sinh_id: '', 
    mon_hoc_id: '', 
    diem_mieng: '', 
    diem_15_phut: '', 
    diem_1_tiet: '', 
    diem_thi: '' 
  });

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/diemso').then(res => setDanhSachDiem(res.data.data));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data));
    axios.get('/monhoc').then(res => setDanhSachMon(res.data.data));
  };

  // Logic Sửa: Đổ dữ liệu từ bảng ngược lên Form
  const handleChonSua = (diem) => {
    setIdDangSua(diem.id);
    setForm({
      hoc_sinh_id: diem.hoc_sinh_id,
      mon_hoc_id: diem.mon_hoc_id,
      diem_mieng: diem.diem_mieng,
      diem_15_phut: diem.diem_15_phut,
      diem_1_tiet: diem.diem_1_tiet,
      diem_thi: diem.diem_thi
    });
  };

  const handleLuu = (e) => {
    e.preventDefault();
    // Nếu có idDangSua thì gọi PUT (sửa), không thì gọi POST (thêm)
    const request = idDangSua 
      ? axios.put(`/diemso/${idDangSua}`, form) 
      : axios.post('/diemso', form);

    request.then(() => {
      Swal.fire('Thành công', 'Đã lưu điểm! Hệ thống đã tự động tính ĐTB.', 'success');
      layDuLieu();
      setIdDangSua(null); // Lưu xong thì reset trạng thái sửa
      setForm({ hoc_sinh_id: '', mon_hoc_id: '', diem_mieng: '', diem_15_phut: '', diem_1_tiet: '', diem_thi: '' });
    }).catch((err) => {
      console.error(err);
      Swal.fire('Lỗi', 'Không thể lưu điểm. M check lại xem đã sửa ép kiểu (float) ở Backend chưa nhé!', 'error');
    });
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Chắc chắn xóa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/diemso/${id}`).then(() => {
          Swal.fire('Đã xóa', '', 'success');
          layDuLieu();
        });
      }
    });
  };

  return (
    <div className="container-fluid">
      <h2 className="text-primary fw-bold mb-4">📝 QUẢN LÝ ĐIỂM SỐ</h2>
      
      <div className="card shadow-sm mb-4 border-info">
        <div className="card-header bg-info text-white fw-bold">
            {idDangSua ? '✏️ Đang sửa điểm học sinh' : 'Nhập điểm thành phần (ĐTB sẽ tự động tính)'}
        </div>
        <div className="card-body">
          <form onSubmit={handleLuu} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Học Sinh</label>
              <select className="form-select" value={form.hoc_sinh_id} onChange={e => setForm({...form, hoc_sinh_id: e.target.value})} required disabled={idDangSua}>
                <option value="">-- Chọn học sinh --</option>
                {danhSachHS.map(hs => <option key={hs.id} value={hs.id}>{hs.ho_ten}</option>)}
              </select>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-bold">Môn Học</label>
              <select className="form-select" value={form.mon_hoc_id} onChange={e => setForm({...form, mon_hoc_id: e.target.value})} required disabled={idDangSua}>
                <option value="">-- Chọn môn --</option>
                {danhSachMon.map(mon => <option key={mon.id} value={mon.id}>{mon.ten_mon}</option>)}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label text-secondary fw-bold">Miệng (1)</label>
              <input type="number" step="0.1" min="0" max="10" className="form-control" value={form.diem_mieng} onChange={e => setForm({...form, diem_mieng: e.target.value})} />
            </div>
            
            <div className="col-md-2">
              <label className="form-label text-secondary fw-bold">15 Phút (1)</label>
              <input type="number" step="0.1" min="0" max="10" className="form-control" value={form.diem_15_phut} onChange={e => setForm({...form, diem_15_phut: e.target.value})} />
            </div>
            
            <div className="col-md-2">
              <label className="form-label text-secondary fw-bold">1 Tiết (2)</label>
              <input type="number" step="0.1" min="0" max="10" className="form-control" value={form.diem_1_tiet} onChange={e => setForm({...form, diem_1_tiet: e.target.value})} />
            </div>
            
            <div className="col-md-2">
              <label className="form-label text-secondary fw-bold">Thi HK (3)</label>
              <input type="number" step="0.1" min="0" max="10" className="form-control" value={form.diem_thi} onChange={e => setForm({...form, diem_thi: e.target.value})} />
            </div>

            <div className="col-md-4 d-flex align-items-end gap-2">
              <button type="submit" className={`btn ${idDangSua ? 'btn-warning' : 'btn-info'} text-white w-100 fw-bold fs-6 shadow-sm`}>
                {idDangSua ? '💾 Cập Nhật' : '💾 Lưu Điểm Học Sinh'}
              </button>
              {idDangSua && <button type="button" className="btn btn-secondary fw-bold" onClick={() => { setIdDangSua(null); setForm({ hoc_sinh_id: '', mon_hoc_id: '', diem_mieng: '', diem_15_phut: '', diem_1_tiet: '', diem_thi: '' }); }}>Hủy</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <table className="table table-hover mb-0 text-center">
          <thead className="table-dark">
            <tr>
              <th className="text-start">Học Sinh</th>
              <th>Môn</th>
              <th>Miệng</th>
              <th>15 Phút</th>
              <th>1 Tiết</th>
              <th>Thi</th>
              <th className="text-warning">ĐTB</th>
              <th>Xếp Loại</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {danhSachDiem.map(diem => (
              <tr key={diem.id} className="align-middle">
                <td className="text-start fw-bold text-primary">{diem.hoc_sinh?.ho_ten}</td>
                <td className="fw-bold">{diem.mon_hoc?.ten_mon}</td>
                <td>{diem.diem_mieng ?? '0'}</td>
                <td>{diem.diem_15_phut ?? '0'}</td>
                <td>{diem.diem_1_tiet ?? '0'}</td>
                <td>{diem.diem_thi ?? '0'}</td>
                <td className="fw-bold text-danger fs-5">{diem.diem_trung_binh}</td>
                <td>
                  <span className={`badge p-2 fs-6 shadow-sm ${
                    diem.xep_loai === 'Giỏi' ? 'bg-success' : 
                    diem.xep_loai === 'Khá' ? 'bg-primary' : 
                    diem.xep_loai === 'Trung bình' ? 'bg-warning text-dark' : 'bg-danger'
                  }`}>
                    {diem.xep_loai}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1 justify-content-center">
                    {/* NÚT SỬA TÔI THÊM VÀO ĐÂY NÈ TÈO */}
                    <button className="btn btn-sm btn-outline-warning fw-bold" onClick={() => handleChonSua(diem)}>✏️ Sửa</button>
                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(diem.id)}>🗑️ Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiemSo;