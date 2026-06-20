import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, BranchType } from '../types';
import { leadService } from '../lib/supabase';
import AdminNavbar from './AdminNavbar';
import { 
  Users, 
  Compass, 
  Zap, 
  Cpu, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  Calendar, 
  Phone, 
  Mail, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FolderDot,
  FileCheck2,
  Lock,
  ArrowUpRight,
  ExternalLink,
  MessageSquare,
  FileDown
} from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  customLogo: string | null;
  onLogoUpdate: (logoUrl: string | null) => void;
}

export default function AdminPanel({ onLogout, customLogo, onLogoUpdate }: AdminPanelProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<'All' | BranchType>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | LeadStatus>('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [templateType, setTemplateType] = useState<'intro' | 'follow' | 'meeting'>('intro');
  const [customMessage, setCustomMessage] = useState('');
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!selectedLead) {
      setCustomMessage('');
      return;
    }
    
    const clientName = selectedLead.first_name || '';
    const branchName = selectedLead.branch || '';
    
    if (templateType === 'intro') {
      setCustomMessage(`Dear ${clientName},\n\nThank you for reaching out to our "${branchName}" division at Venture Atelier. We have successfully received your project materials. We would be delighted to analyze your objective and coordinate a brief introductory call with our strategic partners.\n\nWhat are your availabilities this week?\n\nWarm regards,\nThe Venture Atelier Team`);
    } else if (templateType === 'follow') {
      setCustomMessage(`Dear ${clientName},\n\nI hope this message finds you well. I am following up on your project brief matching our "${branchName}" studio.\n\nHave you had the opportunity to progress your reflections? We remain entirely at your service to craft the foundational pieces for your launch.\n\nBest regards,\nVenture Atelier`);
    } else if (templateType === 'meeting') {
      setCustomMessage(`Dear ${clientName},\n\nFollowing up on your diagnostic brief in our "${branchName}" branch, I would like to propose a brief 15-minute introductory call to align on our potential cooperation.\n\nPlease feel free to share your preferred timeslots for the coming days.\n\nSincerely,\nVenture Atelier`);
    }
  }, [selectedLead, templateType]);

  useEffect(() => {
    if (selectedLead && selectedLead.id) {
      const storedNote = localStorage.getItem(`lead_note_${selectedLead.id}`) || '';
      setNoteText(storedNote);
    } else {
      setNoteText('');
    }
  }, [selectedLead]);

  const handleSaveNote = () => {
    if (selectedLead && selectedLead.id) {
      localStorage.setItem(`lead_note_${selectedLead.id}`, noteText);
      showNotification("Follow-up note successfully saved!", "success");
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      showNotification("No briefs available to export", "error");
      return;
    }
    
    const headers = [
      "ID",
      "Date",
      "First Name",
      "Last Name",
      "Email",
      "WhatsApp Phone",
      "Division",
      "Project Type",
      "Maturity",
      "Ambition",
      "Critical Need",
      "Brief Summary",
      "Status"
    ];
    
    const rows = leads.map(lead => [
      lead.id || '',
      new Date(lead.created_at || '').toLocaleDateString('en-US'),
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone || '',
      lead.branch,
      lead.answers?.projectType || '',
      lead.answers?.maturity || '',
      lead.answers?.ambition || '',
      lead.answers?.criticalNeed || '',
      (lead.summary || '').replace(/"/g, '""'),
      lead.status
    ]);
    
    const csvContent = "\uFEFF" 
      + [headers.join(";"), ...rows.map(e => e.map(val => `"${val}"`).join(";"))].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Venture_Atelier_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("CSV exported successfully!", "success");
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Canvas optimization for premium identity logo
          // Resize logo to standard max-width of 240px and max-height of 80px while maintaining aspect ratio
          // This ensures perfect visual crispness for high-dpi screens while optimizing footprint to ~10KB (from 500KB+)
          const canvas = document.createElement('canvas');
          const maxW = 240;
          const maxH = 80;
          let width = img.width;
          let height = img.height;

          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW / width, maxH / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // Export as optimized low-footprint PNG/JPEG DataURL
            const optimizedBase64 = canvas.toDataURL('image/png');
            onLogoUpdate(optimizedBase64);
            showNotification("Atelier Cabinet logo optimized and updated successfully!", "success");
          } else {
            // Fallback to original Base64 if canvas context is unavailable
            onLogoUpdate(reader.result as string);
            showNotification("Atelier Cabinet logo updated successfully!", "success");
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads();
      setLeads(data);
      if (data.length > 0 && !selectedLead) {
        // Automatically pre-select first lead for high-end feel
        setSelectedLead(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setActionLoading(leadId);
    const success = await leadService.updateLeadStatus(leadId, newStatus);
    setActionLoading(null);
    if (success) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showNotification('Status updated successfully', 'success');
    } else {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead from your records?')) return;
    
    setActionLoading(leadId);
    const result = await leadService.deleteLead(leadId);
    setActionLoading(null);
    if (result.success) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }
      showNotification('Lead archived and deleted successfully', 'success');
    } else {
      showNotification(result.error || 'Deletion error', 'error');
    }
  };

  const handleDeleteAllLeads = async () => {
    if (leads.length === 0) {
      showNotification('No leads to delete', 'error');
      return;
    }
    const enteredWord = prompt('WARNING: You are about to permanently delete ALL leads. This action is irreversible.\n\nType DELETE to confirm:');
    if (enteredWord !== 'DELETE') {
      showNotification('Deletion cancelled', 'error');
      return;
    }
    
    setActionLoading('all');
    const result = await leadService.deleteAllLeads();
    setActionLoading(null);
    if (result.success) {
      setLeads([]);
      setSelectedLead(null);
      showNotification('All leads deleted successfully', 'success');
    } else {
      showNotification(result.error || 'Failed to delete all leads', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // KPI Calculations
  const totalLeadsCount = leads.length;
  const countByBranch = (branch: BranchType) => leads.filter(l => l.branch === branch).length;
  const countByStatus = (status: LeadStatus) => leads.filter(l => l.status === status).length;

  const moonCount = countByBranch('Moon');
  const lightCount = countByBranch('Light');
  const forgeCount = countByBranch('Forge');

  // Filtered Leads
  const filteredLeads = leads.filter(lead => {
    const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchQuery.toLowerCase()) || 
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesBranch = selectedBranchFilter === 'All' || lead.branch === selectedBranchFilter;
    const matchesStatus = selectedStatusFilter === 'All' || lead.status === selectedStatusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'Nouveau': 
        return 'bg-amber-400/10 border border-amber-400/30 text-amber-300';
      case 'En cours': 
        return 'bg-blue-400/10 border border-blue-400/30 text-blue-300';
      case 'Signé': 
        return 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-300';
      case 'Archivé': 
        return 'bg-zinc-800 border border-zinc-700 text-zinc-400';
      default: 
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  const getBranchIcon = (branch: BranchType) => {
    switch (branch) {
      case 'Moon': return <Compass className="w-4 h-4 text-[#D4AF37]" />;
      case 'Light': return <Zap className="w-4 h-4 text-[#D4AF37]" />;
      case 'Forge': return <Cpu className="w-4 h-4 text-[#D4AF37]" />;
      case 'Booking': return <Calendar className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <>
      <AdminNavbar onLogout={onLogout} customLogo={customLogo} totalLeads={totalLeadsCount} />

      <div className="pt-28 pb-16 px-6 max-w-7xl mx-auto space-y-10" id="backoffice-panel">
      
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5 text-yellow-500/80" />
            <span>Private Administration Console</span>
          </div>
          <h2 className="text-3xl font-serif text-white tracking-wide mt-1">
            Atelier Leads Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-zinc-850 hover:border-[#D4AF37]/35 bg-zinc-950 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-[#D4AF37] transition-all cursor-pointer"
            title="Export all briefs to CSV format"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export (CSV)</span>
          </button>

          <button
            onClick={handleDeleteAllLeads}
            disabled={actionLoading === 'all'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-950/50 hover:border-red-500/40 bg-zinc-950 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-red-400 transition-all cursor-pointer disabled:opacity-50"
            title="Permanently Delete ALL client leads from the system"
          >
            <Trash2 className="w-4 h-4 text-red-500/80" />
            <span className="hidden sm:inline">Delete All</span>
          </button>

          <button
            onClick={fetchLeads}
            className="p-2.5 rounded-full border border-zinc-850 hover:border-[#D4AF37]/30 bg-zinc-950 text-zinc-400 hover:text-[#D4AF37] transition-all cursor-pointer"
            title="Refresh leads data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onLogout}
            className="px-5 py-2.5 rounded-full border border-zinc-850 hover:border-red-500/30 bg-zinc-950 text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
          >
            Close console
          </button>
        </div>
      </div>

      {/* Pop通知 */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border bg-black/90 text-sm tracking-wide font-sans shadow-lg shadow-black">
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-red-400" />
          )}
          <span className="text-zinc-100">{notification.message}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" id="kpi-grid">
        {/* Total leads Card */}
        <div className="luxury-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase tracking-wider">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="text-4xl font-serif text-gold-gradient font-bold mt-2">
            {loading ? '...' : totalLeadsCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {countByStatus('Nouveau')} new untreated
          </div>
        </div>

        {/* Moon Branch Card */}
        <div className="luxury-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase tracking-wider">
            <span>Studio Moon (Design)</span>
            <Compass className="w-4 h-4 text-[#D4AF37]/50" />
          </div>
          <div className="text-4xl font-serif text-white font-bold mt-2">
            {loading ? '...' : moonCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {totalLeadsCount > 0 ? Math.round((moonCount / totalLeadsCount) * 100) : 0}% share of demand
          </div>
        </div>

        {/* Light Branch Card */}
        <div className="luxury-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase tracking-wider">
            <span>Studio Light (Growth)</span>
            <Zap className="w-4 h-4 text-[#D4AF37]/50" />
          </div>
          <div className="text-4xl font-serif text-white font-bold mt-2">
            {loading ? '...' : lightCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {totalLeadsCount > 0 ? Math.round((lightCount / totalLeadsCount) * 100) : 0}% share of demand
          </div>
        </div>

        {/* Forge Branch Card */}
        <div className="luxury-card p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-32">
          <div className="flex items-center justify-between text-zinc-500 font-mono text-xs uppercase tracking-wider">
            <span>Studio Forge (Engineering)</span>
            <Cpu className="w-4 h-4 text-[#D4AF37]/50" />
          </div>
          <div className="text-4xl font-serif text-white font-bold mt-2">
            {loading ? '...' : forgeCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {totalLeadsCount > 0 ? Math.round((forgeCount / totalLeadsCount) * 100) : 0}% share of demand
          </div>
        </div>
      </div>

      {/* Visual Identity / Logo Branding Control Panel */}
      <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 space-y-4" id="logo-branding-settings">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-lg bg-zinc-950 text-[#D4AF37] border border-zinc-850">
            <FolderDot className="w-5 h-5 col-span-1" />
          </span>
          <div>
            <h3 className="text-lg font-serif text-white tracking-wide">
              Atelier Visual Identity
            </h3>
            <p className="text-[10px] text-[#D4AF37]/80 font-mono uppercase tracking-widest leading-relaxed">
              Venture Atelier Official Logo Configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Logo display area */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-black/40 border border-zinc-900 rounded-xl min-h-[140px] text-center">
            {customLogo ? (
              <div className="relative group p-4 bg-black/80 rounded-xl border border-[#D4AF37]/35">
                <img 
                  src={customLogo} 
                  alt="Custom Logo Preview" 
                  className="max-h-20 max-w-[180px] object-contain rounded border border-[#D4AF37]/15 p-2 bg-black" 
                />
                <button
                  onClick={() => onLogoUpdate(null)}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-950 border border-red-500/40 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                  title="Delete Logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-12 h-12 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-650 mx-auto text-sm font-mono">
                  Ø
                </div>
                <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">No logo configured</div>
                <div className="text-[9px] text-zinc-600 font-sans max-w-[170px] leading-relaxed">
                  The website uses a clean typographic layout until a custom logo is uploaded by the administrator.
                </div>
              </div>
            )}
          </div>

          {/* Logo control actions */}
          <div className="md:col-span-8 space-y-3 font-sans">
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              In accordance with your brand guidelines, <b>no default logo is stored in the vault</b>. 
              Upload your custom brand identity asset below (PNG, JPEG, or SVG). The navbar and footer placeholders will update instantly for all visitors.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <label className="px-5 py-2.5 rounded-full bg-zinc-900 border border-gold-subtle text-xs text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:border-transparent cursor-pointer font-mono uppercase tracking-widest transition-all">
                <span>Select Logo File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </label>

              {customLogo && (
                <button
                  onClick={() => {
                    onLogoUpdate(null);
                    showNotification("The custom logo has been successfully removed.", "success");
                  }}
                  className="px-5 py-2.5 rounded-full bg-zinc-950 border border-zinc-900 text-xs text-zinc-550 hover:text-red-400 hover:border-red-550/25 font-mono uppercase tracking-widest transition-all cursor-pointer"
                >
                  Remove Logo
                </button>
              )}
            </div>
            <p className="text-[9px] text-zinc-600 font-mono tracking-wide">
              Recommendation: Landscape format, transparent background, max size: 500 KB.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Splits into Leads List & Leads Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-split">
        
        {/* LEFT COLUMN: Leads Filter & Chronological List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-4 md:p-6 space-y-4">
            
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, WhatsApp phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-[#D4AF37] outline-none text-xs py-3 pl-11 pr-4 rounded-xl text-zinc-300 font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value as any)}
                    className="appearance-none bg-zinc-950 border border-zinc-900 focus:border-[#D4AF37] text-[11px] font-mono tracking-wide py-3 pl-4 pr-10 rounded-xl text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="All">All Divisions</option>
                    <option value="Moon">Moon</option>
                    <option value="Light">Light</option>
                    <option value="Forge">Forge</option>
                    <option value="Booking">Discovery Calls</option>
                  </select>
                  <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                    className="appearance-none bg-zinc-950 border border-zinc-900 focus:border-[#D4AF37] text-[11px] font-mono tracking-wide py-3 pl-4 pr-10 rounded-xl text-zinc-300 outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Nouveau">New</option>
                    <option value="En cours">In Progress</option>
                    <option value="Signé">Signed</option>
                    <option value="Archivé">Archived</option>
                  </select>
                  <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* List Results */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2" id="leads-list-scroll">
              {loading ? (
                <div className="py-20 text-center text-zinc-500 font-mono text-xs">
                  Securely loading briefs...
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="py-20 text-center text-zinc-650 font-mono text-xs">
                  No briefs match your search filters.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLead && selectedLead.id === lead.id;
                  const formattedDate = new Date(lead.created_at || '').toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md shadow-[#D4AF37]/5' 
                          : 'border-zinc-900 bg-zinc-950 hover:bg-[#0c0c0c]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Suggested branch icon */}
                        <div className="p-2.5 rounded-lg bg-zinc-900 text-[#D4AF37]/80 border border-zinc-800">
                          {getBranchIcon(lead.branch)}
                        </div>

                        <div>
                          <div className="font-semibold text-sm text-zinc-200">
                            {lead.first_name} {lead.last_name}
                          </div>
                          
                          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>
                            <span>&bull;</span>
                            <span className="text-zinc-400 font-semibold">{lead.branch}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(lead.status)}`}>
                          {lead.status === 'Nouveau' ? 'New' : lead.status === 'En cours' ? 'In Progress' : lead.status === 'Signé' ? 'Signed' : 'Archived'}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead.id!);
                          }}
                          disabled={actionLoading === lead.id}
                          className="p-1.5 rounded bg-zinc-900/80 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-850 hover:border-red-900/30 transition-all cursor-pointer disabled:opacity-50"
                          title="Supprimer ce lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <ChevronRight className={`w-4 h-4 transition-transform text-zinc-600 ${isSelected ? 'translate-x-1 text-[#D4AF37]' : ''}`} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="text-[10px] text-zinc-600 font-mono text-right">
              {filteredLeads.length} briefs displayed of {totalLeadsCount} total
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Leads Full Details View (5 cols) */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-6 space-y-6 relative sticky top-24" id="lead-details-card">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">
                    Brief ID: {selectedLead.id?.slice(0, 8)}...
                  </span>
                  <h3 className="text-xl font-serif text-white tracking-wide mt-1">
                    {selectedLead.first_name} {selectedLead.last_name}
                  </h3>
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-[#D4AF37]/80" />
                    Submitted on {new Date(selectedLead.created_at || '').toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <button
                    onClick={() => handleDeleteLead(selectedLead.id!)}
                    disabled={actionLoading === selectedLead.id}
                    className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                    title="Permanently delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Manager Dropdown */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Brief Status:
                </span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id!, e.target.value as LeadStatus)}
                  className="bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#D4AF37] focus:border-[#D4AF37] outline-none tracking-widest uppercase rounded-lg px-3 py-1.5 cursor-pointer hover:border-gold-bright transition-colors"
                >
                  <option value="Nouveau">New</option>
                  <option value="En cours">In Progress</option>
                  <option value="Signé">Signed</option>
                  <option value="Archivé">Archived</option>
                </select>
              </div>

              {/* Contact Credentials & Communication Actions */}
              <div className="space-y-3">
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                    <Mail className="w-4 h-4 text-[#D4AF37]/75" />
                    <a href={`mailto:${selectedLead.email}`} className="text-zinc-350 hover:text-[#FFE082] transition-colors break-all flex items-center gap-1">
                      {selectedLead.email}
                      <ArrowUpRight className="w-3 h-3 opacity-55" />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950 border border-zinc-900">
                    <Phone className="w-4 h-4 text-[#D4AF37]/75" />
                    <div className="flex flex-col">
                      <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mb-0.5">WhatsApp Phone</span>
                      {selectedLead.phone && selectedLead.phone.trim() ? (
                        <a 
                          href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-zinc-350 hover:text-[#FFE082] transition-colors flex items-center gap-1 font-mono text-xs"
                        >
                          {selectedLead.phone}
                          <ArrowUpRight className="w-3 h-3 opacity-55" />
                        </a>
                      ) : (
                        <span className="text-zinc-650 italic text-xs">No number provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct quick communication launcher with dynamic content customizer */}
                <div className="space-y-3 bg-[#090909] border border-zinc-900 rounded-xl p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] block">
                      Client Message Generator
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setTemplateType('intro')}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider transition-colors ${templateType === 'intro' ? 'bg-[#D4AF37] text-black font-semibold' : 'bg-zinc-950 text-[#D4AF37] hover:text-white'}`}
                      >
                        Intro
                      </button>
                      <button
                        onClick={() => setTemplateType('follow')}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider transition-colors ${templateType === 'follow' ? 'bg-[#D4AF37] text-black font-semibold' : 'bg-zinc-950 text-[#D4AF37] hover:text-white'}`}
                      >
                        Follow-up
                      </button>
                      <button
                        onClick={() => setTemplateType('meeting')}
                        className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-wider transition-colors ${templateType === 'meeting' ? 'bg-[#D4AF37] text-black font-semibold' : 'bg-zinc-950 text-[#D4AF37] hover:text-white'}`}
                      >
                        Meeting
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full text-[11px] bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-[#D4AF37] text-zinc-300 font-sans p-2 rounded-lg outline-none min-h-[90px] max-h-[140px] resize-none"
                    placeholder="Edit response message here..."
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`mailto:${selectedLead.email}?subject=${encodeURIComponent("Your project assistance request - Venture Atelier")}&body=${encodeURIComponent(customMessage)}`}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-950 hover:bg-[#D4AF37] border border-gold-subtle/30 hover:border-transparent text-xs text-[#D4AF37] hover:text-black font-semibold rounded-lg font-mono tracking-wider transition-all uppercase"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>E-mail</span>
                    </a>

                    {selectedLead.phone && selectedLead.phone.trim() ? (
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(customMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-950 hover:bg-emerald-600 border border-emerald-500/20 hover:border-transparent text-xs text-emerald-400 hover:text-white font-semibold rounded-lg font-mono tracking-wider transition-all uppercase"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <div
                        className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-950 border border-dashed border-zinc-900 text-xs text-zinc-650 rounded-lg font-mono tracking-wider cursor-not-allowed uppercase"
                        title="No phone number provided by this client"
                      >
                        <MessageSquare className="w-3.5 h-3.5 opacity-30" />
                        <span className="text-zinc-600">WhatsApp N/A</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Branch Suggested */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block">
                  Atelier Studio Recommender
                </span>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#AA7C11]/10 to-amber-500/[0.02] border border-[#D4AF37]/25">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {getBranchIcon(selectedLead.branch)}
                    <span>Studio {selectedLead.branch.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-light mt-1.5 leading-relaxed">
                    {selectedLead.branch === 'Moon' && 'Creative artistic direction & immersive UX recommended.'}
                    {selectedLead.branch === 'Light' && 'Luxury digital marketing, elite SEO & conversion funnels required.'}
                    {selectedLead.branch === 'Forge' && 'Rich software development, resilient APIs & Cloud engineering required.'}
                  </p>
                </div>
              </div>

              {/* If it's a discovery booking call, show appointment details; otherwise show diagnostic questionnaire */}
              {selectedLead.booking_date ? (
                <div className="space-y-3 font-sans">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block">
                    Discovery Booking Details
                  </span>
                  <div className="space-y-3 bg-zinc-950 rounded-xl p-4 border border-[#D4AF37]/20 text-xs shadow-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-mono">Appointment Date</div>
                        <div className="text-white font-semibold flex items-center gap-1.5 pl-2 border-l border-amber-500/30">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{selectedLead.booking_date}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-500 font-mono">Appointment Time</div>
                        <div className="text-white font-semibold flex items-center gap-1.5 pl-2 border-l border-amber-500/30">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="font-mono">{selectedLead.booking_time}</span>
                        </div>
                      </div>
                    </div>
                    {selectedLead.booking_notes && (
                      <div className="space-y-1 pt-2 border-t border-zinc-900">
                        <div className="text-[10px] text-zinc-500 font-mono">Project Scope / Inquiries</div>
                        <div className="text-zinc-300 font-sans italic pl-2 border-l border-amber-500/30 leading-relaxed">
                          "{selectedLead.booking_notes}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedLead.answers ? (
                <div className="space-y-3 font-sans">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                    Diagnostic & Survey Details
                  </span>

                  <div className="space-y-3 bg-zinc-950 rounded-xl p-4 border border-zinc-900 text-xs">
                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-mono">1. What do you want to build?</div>
                      <div className="text-zinc-200 font-semibold pl-2 border-l border-amber-500/30">
                        {selectedLead.answers.projectType}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-mono">2. Current stage of maturity:</div>
                      <div className="text-zinc-200 font-semibold pl-2 border-l border-amber-500/30">
                        {selectedLead.answers.maturity}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-mono">3. Short-term objective:</div>
                      <div className="text-zinc-200 font-semibold pl-2 border-l border-amber-500/30">
                        {selectedLead.answers.ambition}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-zinc-500 font-mono">4. Priority assistance need:</div>
                      <div className="text-zinc-200 font-semibold pl-2 border-l border-amber-500/30">
                        {selectedLead.answers.criticalNeed}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Editable Need summary display */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block">
                  User-Authored Summary & Notes
                </span>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 text-xs text-zinc-300 font-light leading-relaxed whitespace-pre-line font-serif italic text-gold-gradient-light/80">
                  "{selectedLead.summary}"
                </div>
              </div>

              {/* Private Follow-up notes */}
              <div className="space-y-2 border-t border-zinc-900 pt-5 mt-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block">
                  Internal Follow-up Notes (Private & Persistent)
                </span>
                <div className="space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter your follow-up notes, interview remarks or current lead status information here..."
                    className="w-full text-xs font-sans bg-zinc-900 hover:bg-[#0a0a0a] focus:bg-[#0a0a0a] border border-zinc-800 focus:border-[#D4AF37] text-zinc-300 p-2.5 rounded-lg outline-none min-h-[60px]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 rounded-md bg-zinc-900 border border-gold-subtle hover:border-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#050505] border border-zinc-900 rounded-2xl p-16 text-center text-zinc-650 font-mono text-xs h-[450px] flex items-center justify-center sticky top-24">
              Select a lead dossier on the left sidebar to start the detailed analysis.
            </div>
          )}
        </div>

      </div>

    </div>
  </>
  );
}
