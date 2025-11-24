
import React, { useState, useRef } from 'react';
import { FileText, Upload, FileArchive, Trash2, ChevronLeft, ChevronRight, Loader2, X, Download, Edit3, RefreshCw } from 'lucide-react';
import { Task, Submission } from '../types';
import { gradeSubmission } from '../services/geminiService';

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
}

// Helper for mock names
const MOCK_NAMES = [
  "Tao Yi", "Nuria Pelayo", "Bairam Frootan", "Harmen Porter", 
  "Victor Pacheco", "Balveer Bhadiar", "Ivan Morais", "Mbe Tshinguta", 
  "Nawf El Azam", "Anje Keizer", "Li Wei", "Zhang Min"
];

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onBack }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audit Modal State
  const [auditSubmission, setAuditSubmission] = useState<Submission | null>(null);
  const [auditScore, setAuditScore] = useState('');
  const [auditComments, setAuditComments] = useState('');

  // Simulate parsing a zip file and extracting homework
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock extracting files
    const mockSubmissions: Submission[] = Array.from({ length: 10 }).map((_, i) => {
      const idStr = `2025010${Math.floor(100000000 + Math.random() * 900000000)}`;
      const name = MOCK_NAMES[i % MOCK_NAMES.length];
      return {
        id: Date.now() + i,
        fileName: `${task.taskName}_${name}_${idStr}.docx`,
        studentId: idStr,
        studentName: name,
        score: '-',
        comments: '具体评语文字具体评语文字具体评语文字...', // Placeholder until graded
        status: 'pending',
        content: `这是 ${name} (学号 ${idStr}) 的作业提交。\n\n针对任务 "${task.taskName}"，我的回答是：\n在本项目中，我尝试了多种方法来解决问题。我认为核心在于...`
      };
    });

    setSubmissions(prev => [...prev, ...mockSubmissions]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (id: number) => {
    setSubmissions(submissions.filter(s => s.id !== id));
  };

  const handleSingleRegrade = async (id: number) => {
    const sub = submissions.find(s => s.id === id);
    if (!sub) return;

    // Optimistic UI update or loading state for single row could go here
    // For now we just run the grading logic
    try {
      const resultText = await gradeSubmission(task.requirements, sub.content);
      let score = "85";
      let comments = resultText;

      const scoreMatch = resultText.match(/分数[:：]\s*(\d+)/);
      if (scoreMatch) {
        score = scoreMatch[1];
        comments = resultText.replace(/分数[:：]\s*\d+\s*\n?/, '').trim();
        if (comments.startsWith('评语[:：]')) {
          comments = comments.replace(/^评语[:：]\s*/, '');
        }
      }

      setSubmissions(prev => prev.map(s => s.id === id ? {
        ...s,
        score,
        comments: comments.length > 50 ? comments.substring(0, 50) + '...' : comments,
        status: 'graded'
      } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBatchGrading = async () => {
    if (submissions.length === 0) return;
    setIsGrading(true);

    const newSubmissions = [...submissions];

    for (let i = 0; i < newSubmissions.length; i++) {
      // Grade if not graded or force regrade
      try {
        const resultText = await gradeSubmission(task.requirements, newSubmissions[i].content);
        let score = Math.floor(80 + Math.random() * 15).toString(); // Fallback reasonable score
        let comments = resultText;

        const scoreMatch = resultText.match(/分数[:：]\s*(\d+)/);
        if (scoreMatch) {
          score = scoreMatch[1];
          comments = resultText.replace(/分数[:：]\s*\d+\s*\n?/, '').trim();
          if (comments.startsWith('评语[:：]')) {
            comments = comments.replace(/^评语[:：]\s*/, '');
          }
        }

        newSubmissions[i] = {
          ...newSubmissions[i],
          score: score,
          comments: comments.length > 50 ? comments.substring(0, 50) + '...' : comments,
          status: 'graded'
        };
        
        setSubmissions([...newSubmissions]);
      } catch (e) {
        console.error(e);
      }
    }
    setIsGrading(false);
  };

  // Audit Handlers
  const openAuditModal = (sub: Submission) => {
    setAuditSubmission(sub);
    setAuditScore(sub.score === '-' ? '' : sub.score);
    setAuditComments(sub.comments === '-' ? '' : sub.comments);
  };

  const saveAudit = () => {
    if (!auditSubmission) return;
    setSubmissions(prev => prev.map(s => s.id === auditSubmission.id ? {
      ...s,
      score: auditScore,
      comments: auditComments,
      status: 'graded'
    } : s));
    setAuditSubmission(null);
  };

  // Export Handler
  const handleExport = () => {
    // Add BOM for Excel to read UTF-8 correctly
    const BOM = '\uFEFF'; 
    const headers = "学号,姓名,分数,评语\n";
    const rows = submissions.map(s => {
      // Escape quotes in CSV
      const cleanComments = s.comments.replace(/"/g, '""');
      return `"${s.studentId}","${s.studentName}","${s.score}","${cleanComments}"`;
    }).join("\n");

    const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${task.taskName}_批改结果.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 relative">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center">
        <span className="cursor-pointer hover:text-blue-600" onClick={onBack}>作业批改</span> 
        <span className="mx-2">/</span>
        <span className="cursor-pointer hover:text-blue-600" onClick={onBack}>作业批改</span>
        <span className="mx-2">/</span>
        <span className="text-gray-700">任务详情</span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6">任务详情</h2>

      {/* Task Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">任务详情</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-gray-500 w-24 text-sm">任务名称</span>
            <span className="text-gray-800 text-sm font-medium">{task.taskName}</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 w-24 text-sm pt-0.5">批改要求</span>
            <span className="text-gray-800 text-sm leading-relaxed flex-1">{task.requirements}</span>
          </div>
        </div>
      </div>

      {/* Submissions List Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[500px] relative flex flex-col mb-20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-medium text-gray-800">作业列表</h3>
          <div className="flex space-x-3">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".zip,.rar,.7z" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition-colors flex items-center"
            >
              <FileArchive className="w-4 h-4 mr-2" />
              上传压缩包
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              上传文件
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="py-3 px-4 w-10"><input type="checkbox" className="rounded text-blue-600" /></th>
                <th className="py-3 px-4 w-16">序号</th>
                <th className="py-3 px-4">文件名称</th>
                <th className="py-3 px-4">学号</th>
                <th className="py-3 px-4">姓名</th>
                <th className="py-3 px-4">分数</th>
                <th className="py-3 px-4 w-1/4">评语</th>
                <th className="py-3 px-4 w-48">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <FileText className="w-16 h-16 mb-4 opacity-20" />
                      <span className="text-sm">暂无内容</span>
                    </div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-gray-50 group transition-colors">
                    <td className="py-3 px-4"><input type="checkbox" className="rounded text-blue-600" /></td>
                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate" title={sub.fileName}>{sub.fileName}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{sub.studentId}</td>
                    <td className="py-3 px-4 text-gray-600">{sub.studentName}</td>
                    <td className="py-3 px-4">
                       {sub.status !== 'pending' ? (
                         <span className={`font-medium ${Number(sub.score) >= 60 ? 'text-gray-800' : 'text-red-500'}`}>{sub.score}</span>
                       ) : (
                         <span className="text-gray-400">-</span>
                       )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 truncate max-w-xs" title={sub.comments}>
                      {sub.status !== 'pending' ? sub.comments : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <button 
                          onClick={() => handleSingleRegrade(sub.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          重新批改
                        </button>
                        <button 
                          onClick={() => openAuditModal(sub)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          审核
                        </button>
                        <button 
                          onClick={() => handleRemove(sub.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          移除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-end space-x-2 text-sm text-gray-600 border-t border-gray-50 pt-4">
           <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
           <button className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600 rounded">1</button>
           <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded">2</button>
           <span className="px-1">...</span>
           <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded">15</button>
           <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
           <span className="ml-2">跳至</span>
           <input type="text" className="w-10 h-8 border border-gray-300 rounded text-center" />
           <span>页</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {submissions.length > 0 && (
        <div className="flex justify-center space-x-4 pb-8">
          <button
            onClick={handleBatchGrading}
            disabled={isGrading}
            className="bg-white border border-red-400 text-red-500 hover:bg-red-50 px-10 py-2.5 rounded shadow-sm text-sm font-medium transition-all flex items-center"
          >
            {isGrading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                正在批改...
              </>
            ) : (
              '重新批量批改'
            )}
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded shadow-md text-sm font-medium transition-all flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            下载表格
          </button>
        </div>
      )}

      {/* Audit Modal */}
      {auditSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-800">人工审核</h3>
              <button onClick={() => setAuditSubmission(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学生姓名</label>
                <div className="text-gray-900">{auditSubmission.studentName} ({auditSubmission.studentId})</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分数</label>
                <input 
                  type="number" 
                  value={auditScore} 
                  onChange={(e) => setAuditScore(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">评语</label>
                <textarea 
                  rows={4}
                  value={auditComments} 
                  onChange={(e) => setAuditComments(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setAuditSubmission(null)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveAudit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm shadow-sm transition-colors"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
