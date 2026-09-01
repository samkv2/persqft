import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cmsStore } from '../data/cmsStore';
import type { Project } from '../data/projectsData';
import type { TeamMember } from '../data/cmsStore';

interface AddProjectModalProps {
  onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Residential' as Project['category'],
    location: '',
    status: 'ONGOING' as Project['status'],
    area: '',
    client: '',
    year: new Date().getFullYear(),
    coverImage: '',
    shortDescription: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await cmsStore.addProject({
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      ...formData,
      progress: formData.status === 'COMPLETED' ? 100 : 50,
      gallery: formData.coverImage ? [formData.coverImage] : [],
      description: formData.shortDescription,
      features: []
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Add New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Project['category']})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Interior">Interior</option>
                <option value="Turnkey">Turnkey</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Project['status']})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
              <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Area (e.g. 5000 Sq Ft)</label>
              <input required type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Image URL</label>
            <input required type="url" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button disabled={loading} type="submit" className="w-full py-3 bg-[#397BFF] text-white rounded-lg font-bold mt-4 hover:bg-blue-600">
            {loading ? 'Saving...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface AddTeamModalProps {
  onClose: () => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'EMPLOYEE' as TeamMember['category'],
    image: '',
    tagline: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    cmsStore.addTeamMember(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Add Team Member</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
              <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as TeamMember['category']})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGEMENT">Management</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Profile Image URL (Optional)</label>
            <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Leave blank for auto-avatar" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline (Optional)</label>
            <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <button disabled={loading} type="submit" className="w-full py-3 bg-[#397BFF] text-white rounded-lg font-bold mt-4 hover:bg-blue-600">
            {loading ? 'Saving...' : 'Add Member'}
          </button>
        </form>
      </div>
    </div>
  );
};
