import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { submitStandup, getProjectStandups, checkTodayStandup } from '../services/standupService';
import api from '../services/api';

export default function StandupPage() {
    const { projectId } = useParams();
    const [standups, setStandups] = useState([]);
    const [project, setProject] = useState(null);
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
            const [standupsRes, statusRes, projectRes] = await Promise.all([
                getProjectStandups(projectId),
                checkTodayStandup(projectId),
                api.get(`/project/${projectId}`)
            ]);
            setStandups(standupsRes);
            setAlreadySubmitted(statusRes.submitted);
            setProject(projectRes.data);
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
            loadData();
            setFormData({ yesterday: '', today: '', blockers: '' });
        } catch (err) {
            alert(err.response?.data?.error || "Lỗi khi lưu Stand-up");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {project?.name}
                </span>
            </div>
        }>
            <div className="max-w-5xl mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Form Section */}
                    <div className="lg:col-span-5">
                        <div className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/30 sticky top-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-on-surface">
                                <span className="material-symbols-outlined text-primary">edit_note</span>
                                Ghi Stand-up hôm nay
                            </h2>

                            {alreadySubmitted ? (
                                <div className="bg-success-container/30 border border-success/20 rounded-2xl p-6 text-center">
                                    <span className="material-symbols-outlined text-success text-4xl mb-2">check_circle</span>
                                    <p className="text-on-success-container font-medium">Bạn đã hoàn thành Stand-up ngày hôm nay!</p>
                                    <p className="text-xs text-on-success-container/70 mt-1">Cảm ơn bạn đã cập nhật tiến độ công việc.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-on-surface-variant mb-2">
                                            Hôm qua bạn đã làm gì? <span className="text-error">*</span>
                                        </label>
                                        <textarea
                                            required
                                            value={formData.yesterday}
                                            onChange={(e) => setFormData({...formData, yesterday: e.target.value})}
                                            className="w-full bg-surface-container-high border border-outline-variant rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                                            placeholder="Ghi lại các nhiệm vụ đã hoàn thành..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-on-surface-variant mb-2">
                                            Hôm nay bạn sẽ làm gì? <span className="text-error">*</span>
                                        </label>
                                        <textarea
                                            required
                                            value={formData.today}
                                            onChange={(e) => setFormData({...formData, today: e.target.value})}
                                            className="w-full bg-surface-container-high border border-outline-variant rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                                            placeholder="Kế hoạch làm việc trong ngày..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-on-surface-variant mb-2">
                                            Bạn có gặp khó khăn gì không? (Blockers)
                                        </label>
                                        <textarea
                                            value={formData.blockers}
                                            onChange={(e) => setFormData({...formData, blockers: e.target.value})}
                                            className="w-full bg-surface-container-high border border-outline-variant rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[80px]"
                                            placeholder="Vấn đề đang cản trở tiến độ của bạn..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <div className="w-5 h-5 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">send</span>
                                                Gửi Daily Log
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="lg:col-span-7">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-on-surface">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Lịch sử Stand-up
                            </h2>
                            <span className="text-xs text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10">
                                {standups.length} bản ghi
                            </span>
                        </div>

                        <div className="space-y-6">
                            {standups.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-outline-variant/20 rounded-[32px] flex flex-col items-center justify-center text-on-surface-variant/40 bg-surface-container-low/20">
                                    <span className="material-symbols-outlined text-5xl mb-4">event_busy</span>
                                    <p className="font-medium">Chưa có bản ghi Stand-up nào cho dự án này.</p>
                                </div>
                            ) : (
                                standups.map((log) => (
                                    <div key={log.id} className="bg-surface-container rounded-3xl p-6 shadow-sm border border-outline-variant/20 hover:border-primary/30 transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {log.user.fullName?.[0] || log.user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-on-surface">{log.user.fullName || log.user.email}</h4>
                                                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-bold">
                                                        {formatDate(log.date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="relative pl-6 border-l-2 border-primary/20 group-hover:border-primary/40 transition-all">
                                                <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Yesterday</p>
                                                <p className="text-sm text-on-surface/90 leading-relaxed italic">"{log.yesterday}"</p>
                                            </div>

                                            <div className="relative pl-6 border-l-2 border-primary/20 group-hover:border-primary/40 transition-all">
                                                <p className="text-[10px] font-black text-primary uppercase mb-1 tracking-widest">Today</p>
                                                <p className="text-sm text-on-surface/90 leading-relaxed font-medium">"{log.today}"</p>
                                            </div>

                                            {log.blockers && (
                                                <div className="relative pl-6 border-l-2 border-error/20 group-hover:border-error/40 transition-all">
                                                    <p className="text-[10px] font-black text-error uppercase mb-1 tracking-widest">Blockers</p>
                                                    <p className="text-sm text-error/90 leading-relaxed font-medium">"{log.blockers}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
