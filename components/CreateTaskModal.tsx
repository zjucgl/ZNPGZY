import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { generateTaskRequirements } from '../services/geminiService';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (taskName: string, requirements: string, taskNo: string) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onCreate }) => {
  const [taskName, setTaskName] = useState('');
  const [requirements, setRequirements] = useState('');
  const [taskNo] = useState(`SA00${Math.floor(Math.random() * 90) + 10}`); // Random simplified ID
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    if (!taskName) return;
    setIsGenerating(true);
    const result = await generateTaskRequirements(taskName);
    setRequirements(result);
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    if (taskName && requirements) {
      onCreate(taskName, requirements, taskNo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">任务创建</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Task Name */}
          <div className="flex items-start space-x-4">
             <label className="w-24 text-right text-sm font-medium text-gray-700 pt-2">
               <span className="text-red-500 mr-1">*</span>任务名称
             </label>
             <div className="flex-1">
               <input
                 type="text"
                 value={taskName}
                 onChange={(e) => setTaskName(e.target.value)}
                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                 placeholder="请输入"
               />
             </div>
          </div>

          {/* Task No (Read only for visual) */}
          <div className="flex items-start space-x-4">
             <label className="w-24 text-right text-sm font-medium text-gray-700 pt-2">
               任务编号
             </label>
             <div className="flex-1">
               <input
                 type="text"
                 value={taskNo}
                 readOnly
                 className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-500"
               />
             </div>
          </div>

          {/* Requirements */}
          <div className="flex items-start space-x-4">
             <label className="w-24 text-right text-sm font-medium text-gray-700 pt-2">
               <span className="text-red-500 mr-1">*</span>批改要求
             </label>
             <div className="flex-1 relative">
               <textarea
                 rows={5}
                 value={requirements}
                 onChange={(e) => setRequirements(e.target.value)}
                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                 placeholder="请输入"
               />
               {/* AI Button */}
               <button
                 type="button"
                 onClick={handleGenerateAI}
                 disabled={isGenerating || !taskName}
                 className={`absolute bottom-3 right-3 flex items-center space-x-1 px-2 py-1 rounded text-xs border ${
                   isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
                 } transition-colors`}
                 title="使用 AI 生成批改要求"
               >
                 <Sparkles className="w-3 h-3" />
                 <span>{isGenerating ? '生成中...' : 'AI 生成'}</span>
               </button>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-blue-400 text-blue-600 rounded hover:bg-blue-50 text-sm transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm shadow-sm transition-colors"
          >
            确认创建
          </button>
        </div>
      </div>
    </div>
  );
};
