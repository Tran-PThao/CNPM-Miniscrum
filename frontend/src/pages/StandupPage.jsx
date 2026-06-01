import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import StandupHistory from '../components/StandupHistory';
import { submitStandup, getProjectStandups, checkTodayStandup } from '../services/standupService';
import api from '../services/api';

export default function StandupPage() {
    const { projectId } = useParams();
    const [standups, setStandups] = useState([]);
    const [members, setMembers] = useState([]);
    const [project, setProject] = useState(null);
    const [userRole, setUserRole] = useState('MEMBER');
    const [activeTab, setActiveTab] = useState('submit'); // 'submit' or 'history'
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [formData, setFormData] = useState({
        yesterday: '',
        today: '',
        blockers: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [standupsRes, statusRes, projectRes, membersRes, roleRes] = await Promise.all([
                getProjectStandups(projectId),
                checkTodayStandup(projectId),
                api.get(`/project/${projectId}`),
                api.get(`/project/${projectId}/members`),
                api.get(`/project/${projectId}/role`)
            ]);
            setStandups(standupsRes);
            setAlreadySubmitted(statusRes.submitted);
            setProject(projectRes.data);
            setMembers(membersRes.data);
            setUserRole(roleRes.data.role);
            
            // Nếu là SM hoặc PO, có thể mặc định xem history hoặc dễ dàng chuyển qua
            if ((roleRes.data.role === 'SM' || roleRes.data.role === 'PO') && statusRes.submitted) {
                setActiveTab('history');
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu standup:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitStandup(projectId, formData);
            setAlreadySubmitted(true);
            const updatedStandups = await getProjectStandups(projectId);
            setStandups(updatedStandups);
            setFormData({ yesterday: '', today: '', blockers: '' });
            setActiveTab('history'); // Tự động chuyển qua xem history sau khi gửi
        } catch (err) {
            alert(err.response?.data?.error || "Lỗi khi lưu Stand-up");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <MainLayout projectId={projectId} activePage="Standup" header={
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-on-surface">Daily Stand-up</h1>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {project?.name}
                </span>
            </div>
        }>
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Tab Switcher */}
                <div className="flex justify-center mb-10">
                    <div className="bg-surface-container-low p-1.5 rounded-[24px] flex gap-1 shadow-inner border border-outline-variant/5">
                        <button 
                            onClick={() => setActiveTab('submit')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-[20px] font-bold text-sm transition-all duration-300 ${activeTab === 'submit' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            <span className="material-symbols-outlined text-lg">edit_note</span>
                            Ghi Stand-up
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-[20px] font-bold text-sm transition-all duration-300 ${activeTab === 'history' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            <span className="material-symbols-outlined text-lg">history</span>
                            Lịch sử Team
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'history' ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                                {standups.length}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="animate-in fade-in duration-500">
                    {activeTab === 'submit' ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-surface-container rounded-[40px] p-10 shadow-xl shadow-surface-variant/5 border border-outline-variant/10 relative overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-tertiary/5 rounded-full -ml-16 -mb-16 blur-3xl" />

                                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-on-surface tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">edit_square</span>
                                    </div>
                                    Stand-up Hôm nay
                                </h2>

                                {alreadySubmitted ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-10 text-center animate-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-200">
                                            <span className="material-symbols-outlined text-4xl">check_circle</span>
                                        </div>
                                        <h3 className="text-xl font-black text-emerald-900 mb-2">Tuyệt vời!</h3>
                                        <p className="text-emerald-800/70 font-medium">Bạn đã hoàn thành Stand-up ngày hôm nay.</p>
                                        <button 
                                            onClick={() => setActiveTab('history')}
                                            className="mt-8 px-8 py-3 bg-emerald-100 text-emerald-900 rounded-2xl font-bold hover:bg-emerald-200 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            Xem tiến độ của Team
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 relative">
                                        <div className="grid grid-cols-1 gap-8">
                                            <div>
                                                <label className="block text-xs font-black text-on-surface-variant/60 uppercase tracking-[0.2em] mb-3 ml-1">
                                                    Hôm qua bạn đã làm gì? <span className="text-error font-bold">*</span>
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.yesterday}
                                                    onChange={(e) => setFormData({...formData, yesterday: e.target.value})}
                                                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] shadow-sm placeholder:text-on-surface-variant/30"
                                                    placeholder="Ghi lại các nhiệm vụ đã hoàn thành..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-on-surface-variant/60 uppercase tracking-[0.2em] mb-3 ml-1">
                                                    Hôm nay bạn sẽ làm gì? <span className="text-error font-bold">*</span>
                                                </label>
                                                <textarea
                                                    required
                                                    value={formData.today}
                                                    onChange={(e) => setFormData({...formData, today: e.target.value})}
                                                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] shadow-sm placeholder:text-on-surface-variant/30"
                                                    placeholder="Kế hoạch làm việc trong ngày..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-on-surface-variant/60 uppercase tracking-[0.2em] mb-3 ml-1">
                                                    Bạn có gặp khó khăn gì không?
                                                </label>
                                                <textarea
                                                    value={formData.blockers}
                                                    onChange={(e) => setFormData({...formData, blockers: e.target.value})}
                                                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 text-sm font-medium focus:ring-4 focus:ring-error/10 focus:border-error transition-all min-h-[100px] shadow-sm placeholder:text-on-surface-variant/30"
                                                    placeholder="Vấn đề đang cản trở tiến độ của bạn (nếu có)..."
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary text-on-primary font-black py-5 rounded-3xl hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group active:scale-[0.98]"
                                        >
                                            {submitting ? (
                                                <div className="w-6 h-6 border-3 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                                                    GỬI DAILY LOG
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8 px-4">
                                <div>
                                    <h2 className="text-2xl font-black text-on-surface tracking-tight">Dòng thời gian Stand-up</h2>
                                    <p className="text-sm text-on-surface-variant opacity-70 font-medium">Theo dõi tiến độ và giải quyết khó khăn của cả team</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/10 shadow-sm">
                                        Team SM/PO View
                                    </span>
                                </div>
                            </div>
                            <StandupHistory standups={standups} members={members} />
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
