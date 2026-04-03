import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const { data } = await axios.get('/api/admin/owners', { withCredentials: true });
      setOwners(data);
    } catch (error) {
      toast.error('Failed to fetch owners');
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/owners/${id}/status`, { status }, { withCredentials: true });
      toast.success(`Owner has been ${status}`);
      setOwners(owners.map(o => o._id === id ? { ...o, status } : o));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleBlock = async (id) => {
    try {
      const { data } = await axios.put(`/api/admin/owners/${id}/block`, {}, { withCredentials: true });
      toast.success(data.message);
      setOwners(owners.map(o => o._id === id ? { ...o, isBlocked: data.owner.isBlocked } : o));
    } catch (error) {
      toast.error('Failed to update blocking status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Owners</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading owners...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-semibold">Owner Details</th>
                <th className="px-6 py-4 font-semibold">Company Name</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Blocking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {owners.map((owner) => (
                <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-semibold text-gray-900">{owner.name}</p>
                    <p className="text-sm text-gray-500">{owner.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {owner.companyName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {owner.contactNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      owner.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      owner.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-6">
                      {owner.status === 'pending' && (
                        <div className="flex gap-4">
                          <button onClick={() => updateStatus(owner._id, 'approved')} className="text-green-600 hover:text-green-900 font-semibold hover:underline">Approve</button>
                          <button onClick={() => updateStatus(owner._id, 'rejected')} className="text-red-600 hover:text-red-900 font-semibold hover:underline">Reject</button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => toggleBlock(owner._id)}
                        className={`min-w-[100px] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          owner.isBlocked 
                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                            : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100'
                        }`}
                      >
                        {owner.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOwners;
