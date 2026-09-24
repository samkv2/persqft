import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cmsStore } from '../data/cmsStore';
import type { Project } from '../data/projectsData';
import type { TeamMember, AdminUser } from '../data/cmsStore';

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
          <button disabled={loading} type="submit" className="w-full py-3 bg-[#F48033] hover:bg-[#d96a20] text-white rounded-xl font-bold mt-4 shadow-lg shadow-orange-500/25 transition-colors cursor-pointer">
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
          <button disabled={loading} type="submit" className="w-full py-3 bg-[#F48033] hover:bg-[#d96a20] text-white rounded-xl font-bold mt-4 shadow-lg shadow-orange-500/25 transition-colors cursor-pointer">
            {loading ? 'Saving...' : 'Add Member'}
          </button>
        </form>
      </div>
    </div>
  );
};

interface AddAdminModalProps {
  onClose: () => void;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Data Entry Admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await cmsStore.addAdmin({
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setLoading(false);
      onClose();
    } catch {
      setError('Failed to create admin account.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Create New Admin Account</h2>
            <p className="text-xs text-slate-500 font-mono">For CMS Panel data entry operators</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Display Username</label>
            <input 
              required 
              type="text" 
              placeholder="e.g. rohit_entry" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#F48033] rounded-xl text-xs font-mono outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Login Email ID *</label>
            <input 
              required 
              type="email" 
              placeholder="e.g. dataentry@persqft.com" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#F48033] rounded-xl text-xs font-mono outline-none" 
            />
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">User will use this email ID to sign in.</span>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Login Password * (min 6 chars)</label>
            <input 
              required 
              type="password" 
              minLength={6} 
              placeholder="••••••••••••" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#F48033] rounded-xl text-xs font-mono outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
            <select 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
              className="w-full px-3 py-2.5 border border-slate-200 focus:border-[#F48033] rounded-xl text-xs font-mono outline-none"
            >
              <option value="Data Entry Admin">Data Entry Admin (Content & Quotes)</option>
              <option value="Site Manager">Site Manager (Portfolio & Projects)</option>
              <option value="Co-Admin">Co-Admin (Full Access)</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-[#F48033] hover:bg-[#d96a20] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer">{loading ? 'Creating...' : 'Create Admin'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditAdminModalProps {
  admin: AdminUser;
  isSuperAdmin?: boolean;
  onClose: () => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({ admin, isSuperAdmin = false, onClose }) => {
  const [formData, setFormData] = useState({
    username: admin.username,
    email: admin.email,
    password: '',
    role: admin.role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await cmsStore.updateAdmin(admin.id, {
        username: formData.username,
        email: formData.email,
        role: isSuperAdmin ? formData.role : admin.role,
        ...(formData.password ? { password: formData.password } : {})
      });
      setLoading(false);
      onClose();
    } catch {
      setError('Failed to update admin account.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Edit Admin & Password</h2>
            <p className="text-xs text-slate-500 font-mono">Account ID: #{admin.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Display Username *</label>
            <input 
              required 
              type="text" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              className="w-full px-3 py-2.5 border border-[#D9D6D2] focus:border-[#FF6F2C] rounded-[8px] text-xs font-mono outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Login Email ID *</label>
            <input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              className="w-full px-3 py-2.5 border border-[#D9D6D2] focus:border-[#FF6F2C] rounded-[8px] text-xs font-mono outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reset Password (Optional, leave blank to keep)</label>
            <input 
              type="password" 
              minLength={6} 
              placeholder="•••••••••••• (Leave blank to keep existing)" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="w-full px-3 py-2.5 border border-[#D9D6D2] focus:border-[#FF6F2C] rounded-[8px] text-xs font-mono outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role Assignment</label>
            {isSuperAdmin ? (
              <select 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                className="w-full px-3 py-2.5 border border-[#D9D6D2] focus:border-[#FF6F2C] rounded-[8px] text-xs font-mono outline-none"
              >
                {admin.id === 1 && <option value="PERSQFT HEAD/CEO">PERSQFT HEAD/CEO (Executive)</option>}
                <option value="Data Entry Admin">Data Entry Admin (Content & Quotes)</option>
                <option value="Site Manager">Site Manager (Portfolio & Projects)</option>
                <option value="Co-Admin">Co-Admin (Full Access)</option>
              </select>
            ) : (
              <div className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-[8px] text-xs font-mono text-slate-700 flex items-center justify-between">
                <span className="font-bold">{admin.role}</span>
                <span className="text-[10px] text-slate-400 italic">Locked (CEO Only)</span>
              </div>
            )}
          </div>
          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-[8px] text-xs font-semibold hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white rounded-[8px] text-xs font-bold transition-all shadow-md cursor-pointer">{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

