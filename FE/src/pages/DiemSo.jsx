import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DiemSo = () => {
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]); // MỚI: State lưu danh sách lớp
  
  // State phục vụ việc chọn Lớp và Môn để nhập bảng
  const [selectedLop, setSelectedLop] = useState('');
  const [selectedMon, setSelectedMon] = useState('');
  
  // MỚI: Mảng dữ liệu chứa điểm của cả lớp đang được chọn
  const [batchData, setBatchData] = useState([]); 

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => { layDuLieu(); }, []);

const layDuLieu = () => {
    // 1. Lấy điểm tổng
    axios.get('/diemso')
      .then(res => setDanhSachDiem(res.data.data || []))
      .catch(err => console.error("Lỗi lấy Điểm:", err));

    // 2. Lấy dữ liệu danh mục
    if (userRole !== 'student') {
      
      // Lấy danh sách Môn học
      axios.get('/monhoc')
        .then(res => setDanhSachMon(res.data.data || []))
        .catch(err => console.error("Lỗi lấy Môn học:", err));

      // Lấy danh sách Học sinh
      axios.get('/hocsinh')
        .then(res => setDanhSachHS(res.data.data || []))
        .catch(err => console.error("Lỗi lấy Học sinh:", err));

      // Lấy danh sách Lớp học (Phân nhánh cho Giáo viên và Giáo vụ)
      if (userRole === 'teacher') {
        axios.get('/my-classes')
          .then(res => setDanhSachLop(res.data.data || []))
          .catch(err => console.error("Lỗi lấy Lớp của GV:", err));
      } else {
        axios.get('/lophoc')
          .then(res => setDanhSachLop(res.data.data || []))
          .catch(err => console.error("Lỗi lấy toàn bộ Lớp:", err));
      }
    }
  };

  // MỚI: Tự động tạo bảng điểm Excel khi chọn xong Lớp và Môn
  useEffect(() => {
    if (selectedLop && selectedMon) {
      // Lọc ra các học sinh thuộc lớp đang chọn
const studentsInClass = danhSachHS.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));      
      // Tạo khung nhập điểm cho từng em
      const initialBatch = studentsInClass.map(hs => {
        // Tìm xem học sinh này đã có điểm môn này trong database chưa
        const existingGrade = danhSachDiem.find(d => 
          String(d.hoc_sinh_id) === String(hs.id) && String(d.mon_hoc_id) === String(selectedMon)
        );

        return {
          hoc_sinh_id: hs.id,
          ho_ten: hs.ho_ten,
          // Nếu đã có điểm thì điền sẵn vào ô, chưa có thì để trống
          diem_mieng: existingGrade?.diem_mieng ?? '',
          diem_15_phut: existingGrade?.diem_15_phut ?? '',
          diem_1_tiet: existingGrade?.diem_1_tiet ?? '',
          diem_thi: existingGrade?.diem_thi ?? ''
        };
      });

      setBatchData(initialBatch);
    } else {
      setBatchData([]); // Xóa bảng nếu chưa chọn đủ Lớp và Môn
    }
  }, [selectedLop, selectedMon, danhSachHS, danhSachDiem]);

  // Hàm cập nhật state khi giáo viên gõ điểm vào 1 ô bất kỳ trên bảng
  const handleInputChange = (index, field, value) => {
    const newData = [...batchData];
    newData[index][field] = value;
    setBatchData(newData);
  };

  // MỚI: Hàm gửi toàn bộ bảng điểm lên server
  const handleLuuBatch = (e) => {
    e.preventDefault();
    if(batchData.length === 0) return Swal.fire('Cảnh báo', 'Lớp này chưa có học sinh nào!', 'warning');

    axios.post('/diemso/batch', {
      mon_hoc_id: selectedMon,
      diem_data: batchData
    }).then(() => {
      Swal.fire('Thành công', 'Đã lưu điểm cho toàn bộ lớp! Hệ thống tự động tính ĐTB.', 'success');
      layDuLieu(); // Tải lại dữ liệu để bảng bên dưới cập nhật
      // Xóa form chọn để tránh nhập nhầm
      setSelectedLop('');
      setSelectedMon('');
    }).catch((err) => {
      console.error(err);
      Swal.fire('Lỗi', err.response?.data?.message || 'Không thể lưu điểm hàng loạt.', 'error');
    });
  };

  const handleXoa = (id) => {
    Swal.fire({
      title: 'Xóa dòng điểm này?',
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
    <div className="container-fluid mb-5">
      <h2 className="text-primary fw-bold mb-4">📝 QUẢN LÝ ĐIỂM SỐ</h2>
      
      {/* ========================================== */}
      {/* GIAO DIỆN NHẬP ĐIỂM HÀNG LOẠT (BẢNG EXCEL) */}
      {/* ========================================== */}
      {userRole !== 'student' && (
        <div className="card shadow-sm mb-5 border-info">
          <div className="card-header bg-info text-white fw-bold d-flex justify-content-between align-items-center">
            <span>📚 SỔ ĐIỂM LỚP HỌC (Nhập hàng loạt)</span>
          </div>
          <div className="card-body bg-light">
            {/* Thanh chọn Môn và Lớp */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">1. Chọn Môn Học</label>
                <select className="form-select border-primary" value={selectedMon} onChange={e => setSelectedMon(e.target.value)}>
                  <option value="">-- Chọn môn --</option>
                  {danhSachMon.map(mon => <option key={mon.id} value={mon.id}>{mon.ten_mon}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">2. Chọn Lớp</label>
                <select className="form-select border-primary" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                  <option value="">-- Chọn lớp --</option>
                  {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                </select>
              </div>
            </div>

            {/* Bảng nhập điểm xuất hiện khi đã chọn Môn và Lớp */}
            {selectedLop && selectedMon && (
              <form onSubmit={handleLuuBatch}>
                <div className="table-responsive shadow-sm rounded">
                  <table className="table table-bordered table-hover mb-0 bg-white align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-start" style={{width: '25%'}}>Họ Tên Học Sinh</th>
                        <th>Điểm Miệng</th>
                        <th>Điểm 15 Phút</th>
                        <th>Điểm 1 Tiết</th>
                        <th>Điểm Thi HK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.length > 0 ? batchData.map((item, index) => (
                        <tr key={item.hoc_sinh_id}>
                          <td className="text-start fw-bold text-primary">{item.ho_ten}</td>
                          <td>
                            <input type="number" step="0.1" min="0" max="10" className="form-control form-control-sm text-center" 
                                   value={item.diem_mieng} onChange={e => handleInputChange(index, 'diem_mieng', e.target.value)} />
                          </td>
                          <td>
                            <input type="number" step="0.1" min="0" max="10" className="form-control form-control-sm text-center" 
                                   value={item.diem_15_phut} onChange={e => handleInputChange(index, 'diem_15_phut', e.target.value)} />
                          </td>
                          <td>
                            <input type="number" step="0.1" min="0" max="10" className="form-control form-control-sm text-center" 
                                   value={item.diem_1_tiet} onChange={e => handleInputChange(index, 'diem_1_tiet', e.target.value)} />
                          </td>
                          <td>
                            <input type="number" step="0.1" min="0" max="10" className="form-control form-control-sm text-center" 
                                   value={item.diem_thi} onChange={e => handleInputChange(index, 'diem_thi', e.target.value)} />
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-danger py-3">Lớp này hiện chưa có học sinh nào!</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {batchData.length > 0 && (
                  <div className="mt-3 text-end">
                    <button type="submit" className="btn btn-primary fw-bold px-4 py-2 shadow">
                      💾 LƯU ĐIỂM CẢ LỚP
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* BẢNG LỊCH SỬ TỔNG HỢP (XEM & XÓA)          */}
      {/* ========================================== */}
      <h5 className="text-secondary fw-bold mb-3">BẢNG TỔNG HỢP KẾT QUẢ</h5>
      <div className="card shadow-sm border-0">
        <table className="table table-hover mb-0 text-center">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">Học Sinh</th>
              <th>Môn</th>
              <th>Miệng</th>
              <th>15 Phút</th>
              <th>1 Tiết</th>
              <th>Thi</th>
              <th className="text-danger">ĐTB</th>
              <th>Xếp Loại</th>
              {userRole !== 'student' && <th>Xóa</th>}
            </tr>
          </thead>
          <tbody>
            {danhSachDiem.map(diem => (
              <tr key={diem.id} className="align-middle">
                <td className="text-start fw-bold text-primary">{diem.hoc_sinh?.ho_ten}</td>
                <td className="fw-bold">{diem.mon_hoc?.ten_mon}</td>
                <td>{diem.diem_mieng ?? '-'}</td>
                <td>{diem.diem_15_phut ?? '-'}</td>
                <td>{diem.diem_1_tiet ?? '-'}</td>
                <td>{diem.diem_thi ?? '-'}</td>
                <td className="fw-bold text-danger fs-5">{diem.diem_trung_binh}</td>
                <td>
                  <span className={`badge p-2 shadow-sm ${
                    diem.xep_loai === 'Giỏi' ? 'bg-success' : 
                    diem.xep_loai === 'Khá' ? 'bg-primary' : 
                    diem.xep_loai === 'Trung bình' ? 'bg-warning text-dark' : 'bg-danger'
                  }`}>
                    {diem.xep_loai}
                  </span>
                </td>
                
                {/* Đã bỏ nút Sửa ở đây vì cô giáo chỉ cần Chọn lại Lớp/Môn ở trên là sửa được bảng điểm */}
                {userRole !== 'student' && (
                  <td>
                    <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleXoa(diem.id)}>🗑️</button>
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

export default DiemSo;