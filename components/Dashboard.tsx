import React, { useState } from 'react';
import { 
  Bell, LogOut, FlaskConical, User as UserIcon, Menu, 
  Search, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import { Task, User, DashboardView } from '../types';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetail } from './TaskDetail';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock Initial Data
const INITIAL_TASKS: Task[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  taskNo: 'SA0013',
  taskName: '任务名称',
  requirements: '具体批改要求描述具体批改要求描述具体批改要求描述具体批改要求描述具体批改要求描述',
  creator: '王欣然',
  createdAt: '2025/11/22 09:00:00'
}));

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // View State Management
  const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.LIST);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCreateTask = (name: string, requirements: string, taskNo: string) => {
    const newTask: Task = {
      id: tasks.length + 1,
      taskNo,
      taskName: name,
      requirements: requirements,
      creator: user.name,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    };
    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确认删除此任务吗?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setCurrentView(DashboardView.DETAIL);
  };

  const handleBackToList = () => {
    setSelectedTask(null);
    setCurrentView(DashboardView.LIST);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col shrink-0 z-20`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
           {isSidebarOpen ? (
             <h1 className="text-xl font-bold text-blue-400 tracking-wider truncate px-4">作业批改系统</h1>
           ) : (
             <span className="text-blue-400 font-bold text-xl">A</span>
           )}
        </div>
        
        <div className="flex-1 py-4 space-y-1 overflow-y-auto">
          <div className="bg-blue-900/50 border-l-4 border-blue-500">
             <div className={`flex items-center px-4 py-3 cursor-pointer text-white`}>
               <FlaskConical className="w-5 h-5" />
               {isSidebarOpen && <span className="ml-3 text-sm font-medium">作业批改</span>}
               {isSidebarOpen && <span className="ml-auto rotate-180 text-xs">▲</span>}
             </div>
             {isSidebarOpen && (
               <div className="bg-slate-950/30">
                 <div 
                   onClick={handleBackToList}
                   className="pl-12 pr-4 py-2 text-sm text-blue-400 cursor-pointer bg-blue-800/20 hover:text-blue-300"
                 >
                   作业批改
                 </div>
               </div>
             )}
          </div>

          <div className={`flex items-center px-4 py-3 cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 transition-colors`}>
             <UserIcon className="w-5 h-5" />
             {isSidebarOpen && <span className="ml-3 text-sm font-medium">账号设置</span>}
             {isSidebarOpen && <span className="ml-auto text-xs">▼</span>}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 shrink-0 z-10">
           <div className="flex items-center text-blue-700 font-bold text-lg tracking-wide">
              {/* Mobile logo or breadcrumb start */}
              {!isSidebarOpen && "作业智能辅助批改系统"}
           </div>

           <div className="flex items-center space-x-6">
             <div className="flex items-center space-x-2 text-gray-700">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                  <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
               </div>
               <span className="text-sm font-medium">{user.name}</span>
             </div>

             <div className="relative cursor-pointer text-gray-500 hover:text-gray-700">
               <Bell className="w-5 h-5" />
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full">12</span>
               <span className="ml-1 text-xs align-middle">消息</span>
             </div>

             <button onClick={onLogout} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
               <LogOut className="w-5 h-5" />
               <span className="text-sm">退出</span>
             </button>
           </div>
        </header>

        {/* Content Body Swapper */}
        {currentView === DashboardView.LIST && (
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 mb-2">
              作业批改 / <span className="text-gray-700">作业批改</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">任务列表</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-w-[800px]">
              
              {/* Filters */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-700">任务列表</h3>
                  <button 
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" /> 创建任务
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-3 flex items-center space-x-2">
                      <label className="text-sm text-gray-600 w-20 text-right">任务名称:</label>
                      <input type="text" placeholder="请输入作品名称" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                      <label className="text-sm text-gray-600 w-20 text-right">任务编号:</label>
                      <input type="text" placeholder="请输入作品编号" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                      <label className="text-sm text-gray-600 w-20 text-right">创建人:</label>
                      <input type="text" placeholder="请输入作品编号" className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-blue-500 outline-none" />
                  </div>
                  <div className="col-span-3 flex justify-end space-x-2">
                      <button className="px-4 py-1.5 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm">刷新</button>
                      <button className="px-4 py-1.5 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-sm">重置</button>
                      <button className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center">
                        <Search className="w-3 h-3 mr-1" /> 查询
                      </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4 w-10"><input type="checkbox" className="rounded text-blue-600" /></th>
                      <th className="py-3 px-4">序号</th>
                      <th className="py-3 px-4">任务编号</th>
                      <th className="py-3 px-4">任务名称</th>
                      <th className="py-3 px-4 w-1/3">批改要求</th>
                      <th className="py-3 px-4">创建人</th>
                      <th className="py-3 px-4">创建时间</th>
                      <th className="py-3 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4"><input type="checkbox" className="rounded text-blue-600" /></td>
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{task.taskNo}</td>
                        <td className="py-3 px-4">{task.taskName}</td>
                        <td className="py-3 px-4 truncate max-w-xs text-gray-500" title={task.requirements}>{task.requirements}</td>
                        <td className="py-3 px-4">{task.creator}</td>
                        <td className="py-3 px-4">{task.createdAt}</td>
                        <td className="py-3 px-4 text-center space-x-3">
                          <button 
                            onClick={() => openDetail(task)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            详情
                          </button>
                          <button 
                            onClick={(e) => handleDelete(task.id, e)}
                            className="text-red-400 hover:text-red-600"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-end space-x-2 text-sm text-gray-600">
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-600 rounded">1</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded">2</button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded">3</button>
                <span className="px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded">15</button>
                <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                <span className="ml-2">跳至</span>
                <input type="text" className="w-10 h-8 border border-gray-300 rounded text-center" />
                <span>页</span>
              </div>
            </div>
          </main>
        )}

        {currentView === DashboardView.DETAIL && selectedTask && (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )}

      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTaskModal 
          onClose={() => setShowCreateModal(false)} 
          onCreate={handleCreateTask} 
        />
      )}
    </div>
  );
};