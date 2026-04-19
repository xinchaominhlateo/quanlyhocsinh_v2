import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HanhKiem = () => {
  const [danhSachHK, setDanhSachHK] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [hienThiForm, setHienThiForm] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null); // STATE MỚI: Theo dõi xem có đang sửa không

  const [form, setForm] = useState({ hoc_sinh_id: '', hoc_ki: '1', loai: 'Tốt', nhan_xet: '' });

  useEffect(() => {
    layDuLieu();
  }, []);

  const layDuLieu = () => {
    axios.get('/hanhkiem').then(res => setDanhSachHK(res.data.data));
    axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data));
  };

  // ✅ LOGIC ĐÃ NÂNG CẤP: Nếu đang sửa, bỏ qua việc lọc chính bản ghi đó để Tên học sinh vẫn hiện trên select
  const dsHocSinhChuaXepLoai = danhSachHS.filter(hs => 
    !danhSachHK.some(hk => 
      hk.hoc_sinh_id === hs.id && 
      String(hk.hoc_ki) === String(form.hoc_ki) && 
      hk.id !== idDangSua // Trừ cái đang sửa ra
    )
  );

  // HÀM MỚI: Bấm nút sửa để đưa dữ liệu lên form
  const handleChonSua = (hk) => {
    setIdDangSua(hk.id);
    setForm({
      hoc_sinh_id: hk.hoc_sinh_id,
      hoc_ki: String(hk.hoc_ki),
      loai: hk.loai,
      nhan_xet: hk.nhan_xet || ''
    });
    setHienThiForm(true); // Mở form lên
  };

  const handleLuu = (e) => {
    e.preventDefault();
    
    // Nếu có idDangSua thì gọi API PUT, không thì POST
    const action = idDangSua ? axios.put(`/hanhkiem/${idDangSua}`, form) : axios.post('/hanhkiem', form);

    action.then(() => {
        Swal.fire({ 
          icon: 'success', 
          title: 'Thành công', 
          text: idDangSua ? 'Đã cập nhật hạnh kiểm!' : 'Đã lưu hạnh kiểm cho học sinh!', 
          timer: 1500 
        });
        layDuLieu(); 
        setHienThiForm(false);
        resetForm();
      })
      .catch(error => {
        const msg = error.response?.data?.message || 'Có lỗi xảy ra!';
        Swal.fire({ icon: 'error', title: 'Thất bại', text: msg });
      });
  };

  // HÀM MỚI: Xóa trắng form và tắt chế độ sửa
  const resetForm = () => {
    setForm({ hoc_sinh_id: '', hoc_ki: '1', loai: 'Tốt', nhan_xet: '' });
    setIdDangSua(null);
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa đánh giá?', text: "Hành động này không thể hoàn tác!", icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Xóa', cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hanhkiem/${id}`).then(() => {
          Swal.fire('Đã xóa!', '', 'success');
          layDuLieu();
        });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🎖️ QUẢN LÝ HẠNH KIỂM</h2>
        <button className={`btn fw-bold ${hienThiForm && !idDangSua ? 'btn-secondary' : 'btn-success'}`} 
                onClick={() => {
                  setHienThiForm(!hienThiForm);
                  if (hienThiForm) resetForm(); // Đóng form thì reset luôn
                }}>
          {hienThiForm && !idDangSua ? "❌ Đóng Form" : "+ Đánh giá mới"}
        </button>
      </div>

      {hienThiForm && (
        <div className={`card shadow-sm mb-4 border-${idDangSua ? 'warning' : 'primary'}`}>
          <div className={`card-header text-white fw-bold bg-${idDangSua ? 'warning text-dark' : 'primary'}`}>
            {idDangSua ? '✏️ Sửa Đánh Giá Hạnh Kiểm' : '📝 Nhập Đánh Giá Hạnh Kiểm'}
          </div>
          <div className="card-body">
            <form onSubmit={handleLuu} className="row align-items-end">
              
              <div className="col-md-3 mb-3">
                <label className="fw-bold">1. Chọn Học Kỳ</label>
                <select className={`form-select border-${idDangSua ? 'warning' : 'primary'}`} 
                        value={form.hoc_ki} 
                        onChange={e => setForm({...form, hoc_ki: e.target.value, hoc_sinh_id: ''})}
                        disabled={!!idDangSua} // Khi sửa thì khóa Học Kỳ lại cho an toàn
                >
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="fw-bold">2. Học Sinh (Mã - Tên)</label>
                <select className={`form-select border-${idDangSua ? 'warning' : 'primary'}`}  
                        value={form.hoc_sinh_id}
                        onChange={e => setForm({...form, hoc_sinh_id: e.target.value})} 
                        required
                        disabled={!!idDangSua} // Khi sửa thì khóa luôn Học Sinh
                >
                  <option value="">-- Chọn học sinh --</option>
                  {dsHocSinhChuaXepLoai.map(hs => (
                    <option key={hs.id} value={hs.id}>
                      {hs.ma_hoc_sinh} - {hs.ho_ten}
                    </option>
                  ))}
                </select>
                {dsHocSinhChuaXepLoai.length === 0 && !idDangSua && (
                  <small className="text-danger">Đã hết học sinh cần xếp loại cho HK này!</small>
                )}
              </div>

              <div className="col-md-3 mb-3">
                <label className="fw-bold">3. Xếp Loại</label>
                <select className={`form-select border-${idDangSua ? 'warning' : 'primary'}`} 
                        value={form.loai}
                        onChange={e => setForm({...form, loai: e.target.value})}>
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Yếu">Yếu</option>
                </select>
              </div>

              <div className="col-md-3 mb-3 d-flex gap-2">
                <button type="submit" className={`btn w-100 fw-bold shadow-sm ${idDangSua ? 'btn-warning' : 'btn-primary'}`}>
                  {idDangSua ? '💾 CẬP NHẬT' : '💾 LƯU ĐÁNH GIÁ'}
                </button>
                {idDangSua && (
                  <button type="button" className="btn btn-secondary fw-bold" onClick={() => {
                    setHienThiForm(false);
                    resetForm();
                  }}>
                    HỦY
                  </button>
                )}
              </div>

              <div className="col-12 mb-2">
                <label className="fw-bold">Nhận xét (Nếu có)</label>
                <input type="text" className="form-control" 
                       value={form.nhan_xet}
                       onChange={e => setForm({...form, nhan_xet: e.target.value})} 
                       placeholder="Nhập ghi chú về quá trình rèn luyện..." />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-dark text-center">
              <tr>
                <th className="text-info">Mã HS</th>
                <th className="text-start">Họ Tên Học Sinh</th>
                <th>Học Kỳ</th>
                <th>Xếp Loại</th>
                <th>Nhận Xét</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {danhSachHK.length > 0 ? (
                danhSachHK.map(hk => (
                  <tr key={hk.id} className="align-middle">
                    <td className="fw-bold text-danger">{hk.hoc_sinh?.ma_hoc_sinh}</td>
                    <td className="text-start fw-bold text-primary">{hk.hoc_sinh?.ho_ten}</td>
                    <td><span className="badge bg-light text-dark">Học kỳ {hk.hoc_ki}</span></td>
                    <td>
                      <span className={`badge px-3 py-2 ${
                        hk.loai === 'Tốt' ? 'bg-success' : 
                        hk.loai === 'Khá' ? 'bg-info text-dark' : 
                        hk.loai === 'Trung bình' ? 'bg-warning text-dark' : 'bg-danger'
                      }`}>
                        {hk.loai}
                      </span>
                    </td>
                    <td className="text-muted small">{hk.nhan_xet || '---'}</td>
                    <td>
                      {/* THÊM NÚT SỬA VÀO ĐÂY */}
                      <button className="btn btn-sm btn-outline-warning fw-bold me-2" 
                              onClick={() => handleChonSua(hk)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold" 
                              onClick={() => handleXoa(hk.id)}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-4 text-muted">Chưa có dữ liệu đánh giá nào!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HanhKiem;