import React from 'react';

const Dashboard = () => {
    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold text-primary mb-4">🏠 TRANG CHỦ</h2>
            
            <div className="card shadow p-5 text-center mt-4" style={{ borderRadius: '15px' }}>
                <h3 className="fw-bold text-dark">Chào mừng quay trở lại hệ thống Quản Lý Cấp 3!</h3>
                <p className="text-muted mt-2" style={{ fontSize: '1.1rem' }}>
                    Hãy chọn các chức năng trên thanh menu bên trái để bắt đầu làm việc.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;