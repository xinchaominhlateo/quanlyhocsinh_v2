import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Save, Search, HeartHandshake } from 'lucide-react';

const HanhKiem = () => {
  const [danhSachLopCN, setDanhSachLopCN] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  const [danhSachHanhKiem, setDanhSachHanhKiem] = useState([]);
  const [selectedLop, setSelectedLop] = useState('');
  const [batchData, setBatchData] = useState([]);

  // Lấy role, mặc định là teacher nếu không có
  const userRole = localStorage.getItem('userRole') || 'teacher';

  useEffect(() => { layDuLieu(); }, []);

  // ĐÃ SỬA: Dùng async/await để tải tuần tự và bắt lỗi
  const layDuLieu = async () => {
    try {
      // 1. Tải Lớp
      if (userRole === 'teacher') {
        const resClasses = await axios.get('/my-classes');
        const cacLopChuNhiem = resClasses.data.data.filter(lop => lop.pivot?.vai_tro === 'Chủ nhiệm');
        setDanhSachLopCN(cacLopChuNhiem);
        if (cacLopChuNhiem.length > 0) setSelectedLop(String(cacLopChuNhiem[0].id));
      } else {
        const resClasses = await axios.get('/lophoc');
        setDanhSachLopCN(resClasses.data.data || []);
      }

      // 2. Tải Học Sinh
      const resHS = await axios.get('/hocsinh');
      setDanhSachHS(resHS.data.data || []);

      // 3. Tải Hạnh Kiểm
      const resHK = await axios.get('/hanhkiem');
      setDanhSachHanhKiem(resHK.data.data || []);

    } catch (error) {
      console.error("CHI TIẾT LỖI TẢI DỮ LIỆU:", error);
      Swal.fire('Lỗi API', 'Hệ thống không tải được dữ liệu! Vui lòng ấn F12 xem tab Console.', 'error');
    }
  };

  useEffect(() => {
    if (selectedLop && danhSachHS.length > 0) {
      // Lọc học sinh theo lớp
      const studentsInClass = danhSachHS.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));
      
      const initialBatch = studentsInClass.map(hs => {
        const existing = danhSachHanhKiem.find(hk => String(hk.hoc_sinh_id) === String(hs.id));
        return {
          hoc_sinh_id: hs.id,
          ho_ten: hs.ho_ten,
          xep_loai: existing?.xep_loai || 'Tốt', 
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

  const handleLuuHanhKiem = (e) => {
    e.preventDefault();
    axios.post('/hanhkiem/batch', { hanh_kiem_data: batchData })
      .then(res => {
        Swal.fire('Thành công', res.data.message, 'success');
        layDuLieu();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Không thể lưu hạnh kiểm';
        Swal.fire('Lỗi', errorMsg, 'error');
      });
  };

  return (
    <div className="container-fluid mb-5">
      <h2 className="text-danger fw-bold mb-4 d-flex align-items-center">
        <HeartHandshake className="me-2" size={30} /> ĐÁNH GIÁ HẠNH KIỂM
      </h2>

      <div className="card shadow-sm mb-5 border-0 bg-light">
        <div className="card-header bg-danger text-white fw-bold">🚀 ĐÁNH GIÁ NHANH THEO LỚP CHỦ NHIỆM</div>
        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="fw-bold text-danger">Chọn Lớp Bạn Chủ Nhiệm</label>
              <select className="form-select border-danger" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                <option value="">-- Chọn lớp --</option>
                {danhSachLopCN.map(lop => (
                  <option key={lop.id} value={lop.id}>🏫 {lop.ten_lop}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedLop ? (
            <form onSubmit={handleLuuHanhKiem}>
              <div className="table-responsive">
                <table className="table table-bordered bg-white align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-start" style={{width: '25%'}}>Học Sinh</th>
                      <th style={{width: '25%'}}>Xếp Loại</th>
                      <th style={{width: '50%'}}>Nhận Xét của GVCN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchData.length > 0 ? batchData.map((item, index) => (
                      <tr key={item.hoc_sinh_id}>
                        <td className="text-start fw-bold text-primary">{item.ho_ten}</td>
                        <td>
                          <select 
                            className={`form-select fw-bold text-center ${
                              item.xep_loai === 'Tốt' ? 'text-success' : 
                              item.xep_loai === 'Khá' ? 'text-primary' : 
                              item.xep_loai === 'Trung bình' ? 'text-warning' : 'text-danger'
                            }`}
                            value={item.xep_loai} 
                            onChange={e => handleInputChange(index, 'xep_loai', e.target.value)}
                          >
                            <option value="Tốt">🌟 Tốt</option>
                            <option value="Khá">👍 Khá</option>
                            <option value="Trung bình">😐 Trung bình</option>
                            <option value="Yếu">⚠️ Yếu</option>
                          </select>
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Nhập đánh giá, nhận xét..."
                            value={item.nhan_xet} 
                            onChange={e => handleInputChange(index, 'nhan_xet', e.target.value)} 
                          />
                        </td>
                      </tr>
                    )) : <tr><td colSpan="3" className="text-danger py-3">Lớp này chưa có học sinh nào!</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="text-end mt-3">
                <button type="submit" className="btn btn-danger fw-bold px-4 shadow">
                  <Save size={18} className="me-2"/>LƯU HẠNH KIỂM
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-warning text-center fw-bold">
              Vui lòng chọn Lớp bạn đang làm Chủ nhiệm để tiến hành đánh giá!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HanhKiem;