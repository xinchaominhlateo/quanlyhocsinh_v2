import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HanhKiem = () => {
  const [danhSachHanhKiem, setDanhSachHanhKiem] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  
  const [selectedLop, setSelectedLop] = useState('');
  const [batchData, setBatchData] = useState([]);

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    // 1. Lấy lịch sử hạnh kiểm
    axios.get('/hanhkiem').then(res => setDanhSachHanhKiem(res.data.data || [])).catch(err => console.log(err));

    // 2. Lấy dữ liệu Lớp và Học sinh
    if (userRole !== 'student') {
      axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data || [])).catch(err => console.log(err));

      if (userRole === 'teacher') {
        axios.get('/my-classes').then(res => setDanhSachLop(res.data.data || [])).catch(err => console.log(err));
      } else {
        axios.get('/lophoc').then(res => setDanhSachLop(res.data.data || [])).catch(err => console.log(err));
      }
    }
  };

  // Tự động tạo bảng xếp loại khi chọn Lớp
  useEffect(() => {
    if (selectedLop) {
      const studentsInClass = danhSachHS.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));
      
      const initialBatch = studentsInClass.map(hs => {
        // Kiểm tra xem đã có đánh giá cũ chưa để điền sẵn
        const existing = danhSachHanhKiem.find(hk => String(hk.hoc_sinh_id) === String(hs.id));
        return {
          hoc_sinh_id: hs.id,
          ho_ten: hs.ho_ten,
          loai: existing?.loai || '',
          nhan_xet: existing?.nhan_xet || ''
        };
      });
      setBatchData(initialBatch);
    } else {
      setBatchData([]);
    }
  }, [selectedLop, danhSachHS, danhSachHanhKiem]);

  const handleInputChange = (index, field, value) => {
    const newData = [...batchData];
    newData[index][field] = value;
    setBatchData(newData);
  };

  const handleLuuBatch = (e) => {
    e.preventDefault();
    if(batchData.length === 0) return Swal.fire('Cảnh báo', 'Lớp này chưa có học sinh!', 'warning');

    axios.post('/hanhkiem/batch', { hanh_kiem_data: batchData })
      .then(() => {
        Swal.fire('Thành công', 'Đã lưu đánh giá Hạnh Kiểm cho toàn bộ lớp!', 'success');
        layDuLieu();
        setSelectedLop(''); // Reset form
      })
      .catch((err) => {
        Swal.fire('Lỗi', err.response?.data?.message || 'Không thể lưu!', 'error');
      });
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa đánh giá này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/hanhkiem/${id}`).then(() => {
          Swal.fire('Đã xóa', '', 'success');
          layDuLieu();
        });
      }
    });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">🌟 ĐÁNH GIÁ HẠNH KIỂM</h2>
      
      {/* KHUNG NHẬP HÀNG LOẠT */}
      {userRole !== 'student' && (
        <div className="card shadow-sm mb-5 border-success">
          <div className="card-header bg-success text-white fw-bold">
            📋 NHẬP HẠNH KIỂM THEO LỚP
          </div>
          <div className="card-body bg-light">
            
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Chọn Lớp Đánh Giá</label>
                <select className="form-select border-success" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                  <option value="">-- Vui lòng chọn lớp --</option>
                  {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                </select>
              </div>
            </div>

            {!selectedLop && (
              <div className="alert alert-warning text-center fw-bold shadow-sm rounded-3">
                 Vui lòng chọn 🏫 Lớp để mở danh sách đánh giá hạnh kiểm!
              </div>
            )}

            {selectedLop && (
              <form onSubmit={handleLuuBatch}>
                <div className="table-responsive shadow-sm rounded">
                  <table className="table table-bordered table-hover mb-0 bg-white align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-start" style={{width: '25%'}}>Họ Tên Học Sinh</th>
                        <th style={{width: '25%'}}>Xếp Loại</th>
                        <th>Nhận Xét (Không bắt buộc)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.length > 0 ? batchData.map((item, index) => (
                        <tr key={item.hoc_sinh_id}>
                          <td className="text-start fw-bold text-primary">{item.ho_ten}</td>
                          <td>
                            <select className="form-select text-center fw-bold" value={item.loai} onChange={e => handleInputChange(index, 'loai', e.target.value)}>
                              <option value="">-- Chọn --</option>
                              <option value="Tốt" className="text-success">Tốt</option>
                              <option value="Khá" className="text-primary">Khá</option>
                              <option value="Trung bình" className="text-warning">Trung bình</option>
                              <option value="Yếu" className="text-danger">Yếu</option>
                            </select>
                          </td>
                          <td>
                            <input type="text" className="form-control" placeholder="Ghi chú thêm..."
                                   value={item.nhan_xet} onChange={e => handleInputChange(index, 'nhan_xet', e.target.value)} />
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="3" className="text-danger py-3">Lớp này hiện chưa có học sinh nào!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {batchData.length > 0 && (
                  <div className="mt-3 text-end">
                    <button type="submit" className="btn btn-success fw-bold px-4 py-2 shadow">
                      💾 LƯU HẠNH KIỂM CẢ LỚP
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* BẢNG LỊCH SỬ XEM DỮ LIỆU */}
      <h5 className="text-secondary fw-bold mb-3">LỊCH SỬ ĐÁNH GIÁ</h5>
      <div className="card shadow-sm border-0">
        <table className="table table-hover mb-0 text-center">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">Học Sinh</th>
              <th>Loại Hạnh Kiểm</th>
              <th>Nhận Xét</th>
              {userRole !== 'student' && <th>Xóa</th>}
            </tr>
          </thead>
          <tbody>
            {danhSachHanhKiem.map(hk => (
              <tr key={hk.id} className="align-middle">
                <td className="text-start fw-bold text-primary">{hk.hoc_sinh?.ho_ten}</td>
                <td>
                  <span className={`badge p-2 shadow-sm ${
                    hk.loai === 'Tốt' ? 'bg-success' : 
                    hk.loai === 'Khá' ? 'bg-primary' : 
                    hk.loai === 'Trung bình' ? 'bg-warning text-dark' : 'bg-danger'
                  }`}>
                    {hk.loai}
                  </span>
                </td>
                <td className="text-muted fst-italic">{hk.nhan_xet || '-'}</td>
                
                {userRole !== 'student' && (
                  <td>
                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(hk.id)}>🗑️</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HanhKiem;