import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// --- SỬA: Thêm Edit3 vào đây ---
import { Save, Search, Table, Edit3 } from 'lucide-react'; 

const DiemSo = () => {
  const [danhSachDiem, setDanhSachDiem] = useState([]);
  const [danhSachMon, setDanhSachMon] = useState([]);
  const [danhSachLop, setDanhSachLop] = useState([]);
  const [danhSachHS, setDanhSachHS] = useState([]);
  
  const [selectedMon, setSelectedMon] = useState('');
  const [selectedLop, setSelectedLop] = useState('');
  const [batchData, setBatchData] = useState([]);

  // --- THÊM: State quản lý Modal Đơn xin sửa điểm ---
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    diem_so_id: '',
    hoc_sinh_name: '',
    cot_diem_sai: '',
    diem_moi: '',
    ly_do: ''
  });

  const userRole = localStorage.getItem('userRole') || 'student';

  useEffect(() => { layDuLieu(); }, []);

  const layDuLieu = () => {
    axios.get('/diemso').then(res => setDanhSachDiem(res.data.data || [])).catch(err => console.log(err));

    if (userRole !== 'student') {
      axios.get('/hocsinh').then(res => setDanhSachHS(res.data.data || [])).catch(err => console.log(err));
      
      if (userRole === 'teacher') {
        axios.get('/my-classes').then(res => {
          setDanhSachLop(res.data.data || []);
          if (res.data.mon_hoc) {
            setDanhSachMon([res.data.mon_hoc]); 
            setSelectedMon(res.data.mon_hoc.id); 
          }
        }).catch(err => console.log(err));
      } else {
        axios.get('/monhoc').then(res => setDanhSachMon(res.data.data || [])).catch(err => console.log(err));
        axios.get('/lophoc').then(res => setDanhSachLop(res.data.data || [])).catch(err => console.log(err));
      }
    }
  };

  useEffect(() => {
    if (selectedLop && selectedMon) {
      const studentsInClass = danhSachHS.filter(hs => String(hs.lop_hoc_id) === String(selectedLop));
      const initialBatch = studentsInClass.map(hs => {
        const existing = danhSachDiem.find(d => String(d.hoc_sinh_id) === String(hs.id) && String(d.mon_hoc_id) === String(selectedMon));
        return {
          hoc_sinh_id: hs.id,
          ho_ten: hs.ho_ten,
          diem_id: existing?.id || null, // --- THÊM: Cần ID điểm để biết điểm này đã lưu chưa và để gửi đơn
          diem_mieng: existing?.diem_mieng ?? '',
          diem_15_phut: existing?.diem_15_phut ?? '',
          diem_1_tiet: existing?.diem_1_tiet ?? '',
          diem_thi: existing?.diem_thi ?? ''
        };
      });
      setBatchData(initialBatch);
    } else {
      setBatchData([]);
    }
  }, [selectedLop, selectedMon, danhSachHS, danhSachDiem]);

  const handleInputChange = (index, field, value) => {
    const newData = [...batchData];
    newData[index][field] = value;
    setBatchData(newData);
  };

  const handleLuuDiem = (e) => {
    e.preventDefault();
    axios.post('/diemso/batch', { mon_hoc_id: selectedMon, diem_data: batchData })
      .then(res => {
        Swal.fire('Thành công', res.data.message, 'success');
        layDuLieu();
      })
      .catch(err => Swal.fire('Lỗi', err.response?.data?.message || 'Không thể lưu điểm', 'error'));
  };

  // --- THÊM: Các hàm xử lý Nộp đơn sửa điểm ---
  const openRequestModal = (item, column) => {
    setRequestData({
      diem_so_id: item.diem_id,
      hoc_sinh_name: item.ho_ten,
      cot_diem_sai: column,
      diem_moi: '',
      ly_do: ''
    });
    setShowRequestModal(true);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/don-sua-diem', requestData);
      Swal.fire('Thành công', 'Đã gửi đơn xin sửa điểm lên Giáo vụ/BGH duyệt!', 'success');
      setShowRequestModal(false);
    } catch (error) {
      Swal.fire('Lỗi', error.response?.data?.message || 'Không thể gửi đơn. Vui lòng thử lại.', 'error');
    }
  };

  const formatDiem = (val) => (val !== null && val !== undefined && val !== '') ? val : '-';

  return (
    <div className="container-fluid mb-5 position-relative">
      <h2 className="text-primary fw-bold mb-4">📚 QUẢN LÝ ĐIỂM SỐ</h2>

      {userRole !== 'student' && (
        <div className="card shadow-sm mb-5 border-0 bg-light">
          <div className="card-header bg-primary text-white fw-bold">🚀 NHẬP ĐIỂM NHANH THEO LỚP</div>
          <div className="card-body">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="fw-bold">Chọn Môn Học</label>
                {userRole === 'teacher' ? (
                  <input 
                    type="text" 
                    className="form-control border-primary bg-light" 
                    value={danhSachMon.length > 0 ? danhSachMon[0].ten_mon : ''} 
                    readOnly 
                  />
                ) : (
                  <select className="form-select border-primary" value={selectedMon} onChange={e => setSelectedMon(e.target.value)}>
                    <option value="">-- Chọn môn --</option>
                    {danhSachMon.map(mon => <option key={mon.id} value={mon.id}>{mon.ten_mon}</option>)}
                  </select>
                )}
              </div>
              <div className="col-md-4">
                <label className="fw-bold">Chọn Lớp Học</label>
                <select className="form-select border-primary" value={selectedLop} onChange={e => setSelectedLop(e.target.value)}>
                  <option value="">-- Chọn lớp --</option>
                  {danhSachLop.map(lop => <option key={lop.id} value={lop.id}>{lop.ten_lop}</option>)}
                </select>
              </div>
            </div>

            {selectedLop && selectedMon ? (
              <form onSubmit={handleLuuDiem}>
                <div className="table-responsive">
                  <table className="table table-bordered bg-white align-middle text-center">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-start">Học Sinh</th>
                        <th style={{width:'20%'}}>Miệng</th>
                        <th style={{width:'20%'}}>15 Phút</th>
                        <th style={{width:'20%'}}>1 Tiết (x2)</th>
                        <th style={{width:'20%'}}>Thi HK (x3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.length > 0 ? batchData.map((item, index) => (
                        <tr key={item.hoc_sinh_id}>
                          <td className="text-start fw-bold text-primary">{item.ho_ten}</td>
                          
                          {/* --- SỬA: Đóng gói Input và Button xin sửa vào chung 1 ô --- */}
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <input type="number" step="0.1" className="form-control text-center" value={item.diem_mieng} onChange={e => handleInputChange(index, 'diem_mieng', e.target.value)} disabled={userRole === 'teacher' && item.diem_id} />
                              {userRole === 'teacher' && item.diem_id && (
                                <button type="button" className="btn btn-sm btn-outline-warning px-2" onClick={() => openRequestModal(item, 'diem_mieng')} title="Xin sửa điểm"><Edit3 size={14}/></button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <input type="number" step="0.1" className="form-control text-center" value={item.diem_15_phut} onChange={e => handleInputChange(index, 'diem_15_phut', e.target.value)} disabled={userRole === 'teacher' && item.diem_id} />
                              {userRole === 'teacher' && item.diem_id && (
                                <button type="button" className="btn btn-sm btn-outline-warning px-2" onClick={() => openRequestModal(item, 'diem_15_phut')} title="Xin sửa điểm"><Edit3 size={14}/></button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <input type="number" step="0.1" className="form-control text-center" value={item.diem_1_tiet} onChange={e => handleInputChange(index, 'diem_1_tiet', e.target.value)} disabled={userRole === 'teacher' && item.diem_id} />
                              {userRole === 'teacher' && item.diem_id && (
                                <button type="button" className="btn btn-sm btn-outline-warning px-2" onClick={() => openRequestModal(item, 'diem_1_tiet')} title="Xin sửa điểm"><Edit3 size={14}/></button>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <input type="number" step="0.1" className="form-control text-center" value={item.diem_thi} onChange={e => handleInputChange(index, 'diem_thi', e.target.value)} disabled={userRole === 'teacher' && item.diem_id} />
                              {userRole === 'teacher' && item.diem_id && (
                                <button type="button" className="btn btn-sm btn-outline-warning px-2" onClick={() => openRequestModal(item, 'diem_thi')} title="Xin sửa điểm"><Edit3 size={14}/></button>
                              )}
                            </div>
                          </td>

                        </tr>
                      )) : <tr><td colSpan="5" className="text-danger py-3">Lớp này chưa có học sinh nào!</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="text-end mt-3"><button type="submit" className="btn btn-success fw-bold px-4 shadow"><Save size={18} className="me-2"/>LƯU BẢNG ĐIỂM</button></div>
              </form>
            ) : <div className="alert alert-warning text-center fw-bold">Vui lòng chọn đầy đủ 📚 Môn và 🏫 Lớp để nhập điểm!</div>}
          </div>
        </div>
      )}

      <h5 className="text-secondary fw-bold mb-3"><Search size={20} className="me-2"/>LỊCH SỬ ĐIỂM SỐ</h5>
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="text-start">Học Sinh</th>
                <th>Môn</th>
                <th>Miệng</th>
                <th>15p</th>
                <th>1 Tiết</th>
                <th>Thi</th>
                <th className="text-danger fw-bold">ĐTB</th>
                <th>Xếp Loại</th>
              </tr>
            </thead>
            <tbody>
              {danhSachDiem.map(d => (
                <tr key={d.id}>
                  <td className="text-start fw-bold">{d.hoc_sinh?.ho_ten}</td>
                  <td>{d.mon_hoc?.ten_mon}</td>
                  <td>{formatDiem(d.diem_mieng)}</td>
                  <td>{formatDiem(d.diem_15_phut)}</td>
                  <td>{formatDiem(d.diem_1_tiet)}</td>
                  <td>{formatDiem(d.diem_thi)}</td>
                  <td className="fw-bold text-danger">{d.diem_trung_binh}</td>
                  <td><span className={`badge ${d.xep_loai === 'Giỏi' ? 'bg-success' : d.xep_loai === 'Khá' ? 'bg-primary' : 'bg-warning text-dark'}`}>{d.xep_loai}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- THÊM: Giao diện Cửa sổ Modal điền đơn xin sửa điểm --- */}
      {showRequestModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold">📝 Đơn Xin Sửa Điểm</h5>
                <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
              </div>
              <form onSubmit={submitRequest}>
                <div className="modal-body">
                  <div className="alert alert-info py-2">
                    Học sinh: <strong>{requestData.hoc_sinh_name}</strong><br/>
                    Cột điểm: <strong>{
                      requestData.cot_diem_sai === 'diem_mieng' ? 'Điểm Miệng' :
                      requestData.cot_diem_sai === 'diem_15_phut' ? 'Điểm 15 Phút' :
                      requestData.cot_diem_sai === 'diem_1_tiet' ? 'Điểm 1 Tiết' : 'Điểm Thi HK'
                    }</strong>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Điểm mới đề xuất</label>
                    <input 
                      type="number" step="0.1" min="0" max="10" 
                      className="form-control border-primary" 
                      required 
                      value={requestData.diem_moi} 
                      onChange={e => setRequestData({...requestData, diem_moi: e.target.value})} 
                      placeholder="Nhập điểm cần sửa thành (0 - 10)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Lý do sửa điểm</label>
                    <textarea 
                      className="form-control border-primary" rows="3" 
                      required 
                      value={requestData.ly_do} 
                      onChange={e => setRequestData({...requestData, ly_do: e.target.value})} 
                      placeholder="VD: Do chấm sót ý của học sinh, nhập nhầm dòng..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-success fw-bold">Gửi Ban Giám Hiệu</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiemSo;