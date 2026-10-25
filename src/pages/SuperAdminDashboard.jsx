// src/pages/SuperAdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

   const API = import.meta.env.VITE_API_URL;

const SuperAdminDashboard = () => {
  // ✅ 1. All State Declarations at the Top
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [newSchoolData, setNewSchoolData] = useState({
    school_name: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_phone: '',
    admin_password: 'Password123' // Default secure password
  });

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  // ✅ 2. Data Fetching Functions
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API}/superadmin/schools`, { headers: headers() });
      setSchools(res.data.schools);
    } catch (error) {
      toast.error('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolDetails = async (school) => {
    setSelectedSchool(school);
    try {
      const [adminsRes, subsRes] = await Promise.all([
        axios.get(`${API}/superadmin/schools/${school.id}/admins`, { headers: headers() }),
        axios.get(`${API}/superadmin/schools/${school.id}/subscriptions`, { headers: headers() })
      ]);
      setAdmins(adminsRes.data.admins);
      setSubscriptions(subsRes.data.subscriptions);
    } catch (error) {
      toast.error('Failed to fetch school details');
    }
  };

  // ✅ 3. Action Handlers
  const handleCreateSchool = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/superadmin/schools`,
        newSchoolData,
        { headers: headers() }
      );
      toast.success('School and Admin created successfully!');
      setShowAddSchoolModal(false);
      setNewSchoolData({ 
        school_name: '', 
        admin_first_name: '', 
        admin_last_name: '', 
        admin_phone: '', 
        admin_password: 'Password123' 
      });
      fetchSchools(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create school');
    }
  };

  const handleResetPassword = async (adminId, adminName) => {
    const newPassword = window.prompt(`Enter new password for ${adminName} (leave blank for 'Password123'):`, 'Password123');
    if (newPassword === null) return; // User cancelled

    try {
      await axios.post(
        `${API}/superadmin/admins/${adminId}/reset-password`,
        { new_password: newPassword },
        { headers: headers() }
      );
      toast.success(`Password reset for ${adminName}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleToggleSubscription = async (serviceName, currentState) => {
    try {
      await axios.post(
        `${API}/superadmin/subscriptions`,
        {
          school_id: selectedSchool.id,
          service_name: serviceName,
          is_active: !currentState
        },
        { headers: headers() }
      );
      
      const action = !currentState ? 'activated' : 'deactivated';
      toast.success(`${serviceName.replace('_', ' ')} ${action}!`);
      
      // Refresh subscriptions
      const subsRes = await axios.get(`${API}/superadmin/schools/${selectedSchool.id}/subscriptions`, { headers: headers() });
      setSubscriptions(subsRes.data.subscriptions);
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  // ✅ 4. Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // ✅ 5. Main UI Render
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-purple-600 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">👑 Super Admin Control Tower</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage schools, administrators, and premium service subscriptions.</p>
        </div>
        <button
          onClick={() => setShowAddSchoolModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition flex items-center gap-2"
        >
          <span>➕</span> Onboard New School
        </button>
      </div>

      {/* Schools Grid */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">🏫 Registered Schools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map(school => (
            <div
              key={school.id}
              onClick={() => fetchSchoolDetails(school)}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedSchool?.id === school.id
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                {school.logo_url ? (
                  <img src={school.logo_url} alt={school.name} className="w-12 h-12 rounded-full object-cover bg-white" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                    🏫
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{school.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {school.admin_count} Admins • {school.student_count} Students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${school.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {school.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected School Details */}
      {selectedSchool && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Admins Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              👨‍💼 Administrators: {selectedSchool.name}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 text-left dark:text-gray-300">Name</th>
                    <th className="p-3 text-left dark:text-gray-300">Phone</th>
                    <th className="p-3 text-right dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="p-3 font-medium dark:text-gray-200">{admin.first_name} {admin.last_name}</td>
                      <td className="p-3 dark:text-gray-300">{admin.phone_number}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleResetPassword(admin.id, `${admin.first_name} ${admin.last_name}`)}
                          className="bg-yellow-500 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-yellow-600 transition"
                        >
                          🔑 Reset Password
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr><td colSpan="3" className="p-6 text-center text-gray-500 dark:text-gray-400">No administrators found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscriptions Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              💎 Premium Services: {selectedSchool.name}
            </h3>
            <div className="space-y-3">
              {['sms', 'report_cards', 'analytics', 'offline_sync'].map(service => {
                const sub = subscriptions.find(s => s.service_name === service);
                const isActive = sub?.is_active || false;

                return (
                  <div
                    key={service}
                    className={`p-4 rounded-lg border-2 flex justify-between items-center transition-all ${
                      isActive
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 capitalize">
                        {service.replace('_', ' ')}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isActive ? '✅ Active' : '❌ Inactive'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleSubscription(service, isActive)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                        isActive
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ✅ 6. Add School Modal */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">🏫 Onboard New School</h3>
              <button 
                onClick={() => setShowAddSchoolModal(false)} 
                className="text-gray-500 hover:text-red-500 text-2xl transition"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">School Name</label>
                <input 
                  required 
                  type="text" 
                  value={newSchoolData.school_name} 
                  onChange={e => setNewSchoolData({...newSchoolData, school_name: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="e.g., Meru Excellence Academy" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admin First Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newSchoolData.admin_first_name} 
                    onChange={e => setNewSchoolData({...newSchoolData, admin_first_name: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admin Last Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newSchoolData.admin_last_name} 
                    onChange={e => setNewSchoolData({...newSchoolData, admin_last_name: e.target.value})} 
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500" 
                    placeholder="Kamau" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Admin Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  value={newSchoolData.admin_phone} 
                  onChange={e => setNewSchoolData({...newSchoolData, admin_phone: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500" 
                  placeholder="0712345678" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Initial Password</label>
                <input 
                  required 
                  type="text" 
                  value={newSchoolData.admin_password} 
                  onChange={e => setNewSchoolData({...newSchoolData, admin_password: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500" 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The admin can change this after their first login.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddSchoolModal(false)} 
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold transition shadow-md"
                >
                  Create School & Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;