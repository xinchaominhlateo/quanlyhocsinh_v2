import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const DuyetDonSuaDiem = () => {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => { layDanhSachDon(); }, []);

  const layDanhSachDon = async () => {
    try {
      const res = await axios.get('/don-sua-diem');
      setDanhSachDon(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDuyet = async (id) => {
    try {
      const res = await axios.put(`/don-sua-diem/${id}/duyet`);
      Swal.fire('Thành công', res.data.message, 'success');
      layDanhSachDon(); // Load lại danh sách
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message, 'error');
    }
  };

  const handleTuChoi = async (id) => {
    try {
      const res = await axios.put(`/don-sua-diem/${id}/tu-choi`);
      Swal.fire('Đã từ chối', res.data.message, 'info');
      layDanhSachDon();
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message, 'error');
    }
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">📝 QUẢN LÝ ĐƠN XIN SỬA ĐIỂM</h2>
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>Giáo viên nộp</th>
                <th>Học sinh</th>
                <th>Môn học</th>
                <th>Cột sửa</th>
              <th>Điểm cũ → Mới</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
                {userRole !== 'teacher' && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {danhSachDon.length > 0 ? danhSachDon.map(don => (
                <tr key={don.id}>
                  <td className="fw-bold">{don.giao_vien?.user?.name || 'Ẩn danh'}</td>
                  <td>{don.diem_so?.hoc_sinh?.ho_ten}</td>
                  <td className="text-primary fw-bold">{don.diem_so?.mon_hoc?.ten_mon}</td>
                  <td>{don.cot_diem_sai}</td>
                  <td className="fw-bold">
                    <span className="text-danger">{don.diem_cu}</span> ➡️ <span className="text-success">{don.diem_moi}</span>
                  </td>
                  <td className="text-start fst-italic text-muted">{don.ly_do}</td>
                  <td>
                    <span className={`badge ${don.trang_thai === 'Chờ duyệt' ? 'bg-warning text-dark' : don.trang_thai === 'Đã duyệt' ? 'bg-success' : 'bg-danger'}`}>
                      {don.trang_thai === 'Chờ duyệt' ? <Clock size={14} className="me-1"/> : null}
                      {don.trang_thai}
                    </span>
                  </td>
                  {userRole !== 'teacher' && (
                    <td>
                      {don.trang_thai === 'Chờ duyệt' && (
                        <div className="d-flex justify-content-center gap-2">
                          <button onClick={() => handleDuyet(don.id)} className="btn btn-sm btn-success shadow-sm" title="Duyệt"><CheckCircle size={16}/></button>
                          <button onClick={() => handleTuChoi(don.id)} className="btn btn-sm btn-danger shadow-sm" title="Từ chối"><XCircle size={16}/></button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )) : <tr><td colSpan="8" className="py-4">Chưa có đơn xin sửa điểm nào.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DuyetDonSuaDiem;