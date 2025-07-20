import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { SignOutButton } from "../SignOutButton";
import { toast } from "sonner";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("notices");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any>(null);
  
  const adminInfo = useQuery(api.admin.getAdminInfo);
  const notices = useQuery(api.notices.getAllNotices);
  const teachers = useQuery(api.teachers.getAllTeachers);
  const gallery = useQuery(api.gallery.getAllGallery);
  const chatMessages = useQuery(api.chat.getChatMessages);
  const pendingAdmins = useQuery(api.admin.getPendingAdmins);
  const allAdmins = useQuery(api.admin.getAllAdmins);
  
  const createNotice = useMutation(api.notices.createNotice);
  const updateNotice = useMutation(api.notices.updateNotice);
  const deleteNotice = useMutation(api.notices.deleteNotice);
  
  const addTeacher = useMutation(api.teachers.addTeacher);
  const updateTeacher = useMutation(api.teachers.updateTeacher);
  const deleteTeacher = useMutation(api.teachers.deleteTeacher);
  
  const generateUploadUrl = useMutation(api.gallery.generateUploadUrl);
  const addGalleryItem = useMutation(api.gallery.addGalleryItem);
  const updateGalleryItem = useMutation(api.gallery.updateGalleryItem);
  const deleteGalleryItem = useMutation(api.gallery.deleteGalleryItem);
  
  const replyToChatMessage = useMutation(api.chat.replyToChatMessage);
  const markChatAsRead = useMutation(api.chat.markChatAsRead);
  const approveAdmin = useMutation(api.admin.approveAdmin);
  const removeAdmin = useMutation(api.admin.removeAdmin);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "high" | "medium" | "low"
  });

  const [teacherFormData, setTeacherFormData] = useState({
    name: "",
    designation: "",
    department: "",
    qualification: "",
    experience: "",
    email: "",
    phone: "",
    bio: "",
    order: 0
  });

  const [galleryFormData, setGalleryFormData] = useState({
    title: "",
    description: "",
    category: "events"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNotice) {
        await updateNotice({
          noticeId: editingNotice._id,
          ...formData
        });
        toast.success("Notice updated successfully!");
        setEditingNotice(null);
      } else {
        await createNotice(formData);
        toast.success("Notice created successfully!");
        setShowCreateForm(false);
      }
      
      setFormData({ title: "", content: "", priority: "medium" });
    } catch (error) {
      toast.error("Failed to save notice");
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageId = undefined;
      
      if (selectedFile) {
        setIsUploading(true);
        const uploadUrl = await generateUploadUrl();
        
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });
        
        const { storageId } = await result.json();
        imageId = storageId;
      }

      if (editingTeacher) {
        await updateTeacher({
          teacherId: editingTeacher._id,
          ...teacherFormData,
          ...(imageId && { imageId })
        });
        toast.success("Teacher updated successfully!");
        setEditingTeacher(null);
      } else {
        await addTeacher({
          ...teacherFormData,
          ...(imageId && { imageId })
        });
        toast.success("Teacher added successfully!");
      }
      
      setTeacherFormData({
        name: "",
        designation: "",
        department: "",
        qualification: "",
        experience: "",
        email: "",
        phone: "",
        bio: "",
        order: 0
      });
      setSelectedFile(null);
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to save teacher");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }
    
    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      const { storageId } = await result.json();

      if (editingGalleryItem) {
        await updateGalleryItem({
          itemId: editingGalleryItem._id,
          ...galleryFormData
        });
        toast.success("Gallery item updated successfully!");
        setEditingGalleryItem(null);
      } else {
        await addGalleryItem({
          ...galleryFormData,
          imageId: storageId
        });
        toast.success("Gallery item added successfully!");
      }
      
      setGalleryFormData({
        title: "",
        description: "",
        category: "events"
      });
      setSelectedFile(null);
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Failed to save gallery item");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (notice: any) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority
    });
    setShowCreateForm(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setEditingTeacher(teacher);
    setTeacherFormData({
      name: teacher.name,
      designation: teacher.designation,
      department: teacher.department,
      qualification: teacher.qualification,
      experience: teacher.experience,
      email: teacher.email || "",
      phone: teacher.phone || "",
      bio: teacher.bio || "",
      order: teacher.order
    });
    setShowCreateForm(true);
  };

  const handleEditGalleryItem = (item: any) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
      title: item.title,
      description: item.description || "",
      category: item.category
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (noticeId: any) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice({ noticeId });
        toast.success("Notice deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete notice");
      }
    }
  };

  const handleDeleteTeacher = async (teacherId: any) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      try {
        await deleteTeacher({ teacherId });
        toast.success("Teacher deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete teacher");
      }
    }
  };

  const handleDeleteGalleryItem = async (itemId: any) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await deleteGalleryItem({ itemId });
        toast.success("Gallery item deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete gallery item");
      }
    }
  };

  const toggleNoticeStatus = async (notice: any) => {
    try {
      await updateNotice({
        noticeId: notice._id,
        isActive: !notice.isActive
      });
      toast.success(`Notice ${notice.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update notice status");
    }
  };

  const toggleTeacherStatus = async (teacher: any) => {
    try {
      await updateTeacher({
        teacherId: teacher._id,
        isActive: !teacher.isActive
      });
      toast.success(`Teacher ${teacher.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update teacher status");
    }
  };

  const toggleGalleryItemStatus = async (item: any) => {
    try {
      await updateGalleryItem({
        itemId: item._id,
        isVisible: !item.isVisible
      });
      toast.success(`Gallery item ${item.isVisible ? 'hidden' : 'shown'} successfully!`);
    } catch (error) {
      toast.error("Failed to update gallery item status");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!adminInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">
                  Welcome, {adminInfo.user?.email} ({adminInfo.role})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const event = new CustomEvent('toggleAdminPanel');
                  window.dispatchEvent(event);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View Website
              </button>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("notices")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notices"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Notices
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "teachers"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Teachers
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gallery"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Gallery
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Live Chat
            </button>
            {adminInfo?.role === "super_admin" && (
              <button
                onClick={() => setActiveTab("admins")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "admins"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Manage Admins
              </button>
            )}
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Statistics
            </button>
          </nav>
        </div>

        {/* Notices Tab */}
        {activeTab === "notices" && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notice Management</h2>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingNotice(null);
                  setFormData({ title: "", content: "", priority: "medium" });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create New Notice
              </button>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && activeTab === "notices" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingNotice ? "Edit Notice" : "Create New Notice"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      {editingNotice ? "Update Notice" : "Create Notice"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingNotice(null);
                        setFormData({ title: "", content: "", priority: "medium" });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notices List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {notices === undefined ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : notices && notices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {notices.map((notice) => (
                        <tr key={notice._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {notice.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {notice.content}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                              {notice.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              notice.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {notice.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(notice.publishedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleEdit(notice)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleNoticeStatus(notice)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              {notice.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDelete(notice._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Notices Yet</h3>
                  <p className="text-gray-500">Create your first notice to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === "teachers" && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingTeacher(null);
                  setTeacherFormData({
                    name: "",
                    designation: "",
                    department: "",
                    qualification: "",
                    experience: "",
                    email: "",
                    phone: "",
                    bio: "",
                    order: 0
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add New Teacher
              </button>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && activeTab === "teachers" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                </h3>
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={teacherFormData.name}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={teacherFormData.designation}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, designation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={teacherFormData.department}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Department</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Bangla">Bangla</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={teacherFormData.qualification}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, qualification: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="text"
                        value={teacherFormData.experience}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, experience: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={teacherFormData.email}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={teacherFormData.phone}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={teacherFormData.order}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={teacherFormData.bio}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      {isUploading ? "Uploading..." : editingTeacher ? "Update Teacher" : "Add Teacher"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingTeacher(null);
                        setSelectedFile(null);
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Teachers List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {teachers === undefined ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : teachers && teachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {teachers.map((teacher) => (
                    <div key={teacher._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        {teacher.imageUrl ? (
                          <img
                            src={teacher.imageUrl}
                            alt={teacher.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              {teacher.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                          <p className="text-sm text-blue-600">{teacher.designation}</p>
                          <p className="text-sm text-gray-500">{teacher.department}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-medium">Qualification:</span> {teacher.qualification}</p>
                        <p><span className="font-medium">Experience:</span> {teacher.experience}</p>
                        {teacher.email && <p><span className="font-medium">Email:</span> {teacher.email}</p>}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          teacher.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {teacher.isActive ? "Active" : "Inactive"}
                        </span>
                        
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleTeacherStatus(teacher)}
                            className="text-yellow-600 hover:text-yellow-900 text-sm"
                          >
                            {teacher.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher._id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Teachers Yet</h3>
                  <p className="text-gray-500">Add your first teacher to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setEditingGalleryItem(null);
                  setGalleryFormData({
                    title: "",
                    description: "",
                    category: "events"
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add New Photo
              </button>
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && activeTab === "gallery" && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingGalleryItem ? "Edit Gallery Item" : "Add New Photo"}
                </h3>
                <form onSubmit={handleGallerySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={galleryFormData.title}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={galleryFormData.category}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="events">Events</option>
                      <option value="campus">Campus</option>
                      <option value="activities">Activities</option>
                      <option value="achievements">Achievements</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={galleryFormData.description}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!editingGalleryItem}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      {isUploading ? "Uploading..." : editingGalleryItem ? "Update Photo" : "Add Photo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingGalleryItem(null);
                        setSelectedFile(null);
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {gallery === undefined ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : gallery && gallery.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                  {gallery.map((item) => (
                    <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.imageUrl || "/api/placeholder/400/400"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.isVisible 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <button
                            onClick={() => handleEditGalleryItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleGalleryItemStatus(item)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            {item.isVisible ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Yet</h3>
                  <p className="text-gray-500">Add your first photo to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Chat Messages</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {chatMessages === undefined ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : chatMessages && chatMessages.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {chatMessages.map((message) => (
                    <div key={message._id} className="p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.name}</h3>
                          <p className="text-sm text-gray-500">{message.email}</p>
                          <p className="text-xs text-gray-400">{formatDate(message.submittedAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.isRead 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {message.isRead ? "Read" : "Unread"}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.isReplied 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {message.isReplied ? "Replied" : "Pending"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{message.message}</p>
                      </div>
                      
                      {message.reply && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Reply:</h4>
                          <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">{message.reply}</p>
                          {message.repliedAt && (
                            <p className="text-xs text-gray-500 mt-1">Replied on {formatDate(message.repliedAt)}</p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-3">
                        {!message.isRead && (
                          <button
                            onClick={() => markChatAsRead({ chatId: message._id })}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                        
                        {!message.isReplied && (
                          <button
                            onClick={() => {
                              const reply = prompt("Enter your reply:");
                              if (reply) {
                                replyToChatMessage({ chatId: message._id, reply });
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
                  <p className="text-gray-500">Chat messages from visitors will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Management Tab */}
        {activeTab === "admins" && adminInfo?.role === "super_admin" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Management</h2>
            
            {/* Pending Admins */}
            {pendingAdmins && pendingAdmins.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Admin Requests</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {pendingAdmins.map((admin) => (
                      <div key={admin._id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-900">{admin.user?.name || "Unknown User"}</h4>
                            <p className="text-sm text-gray-500">{admin.user?.email}</p>
                            <p className="text-xs text-gray-400">Requested on {formatDate(admin.createdAt)}</p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => approveAdmin({ adminId: admin._id })}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => removeAdmin({ adminId: admin._id })}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* All Admins */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Admins</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {allAdmins === undefined ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : allAdmins && allAdmins.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {allAdmins.map((admin) => (
                      <div key={admin._id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-gray-900">{admin.user?.name || "Unknown User"}</h4>
                            <p className="text-sm text-gray-500">{admin.user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                admin.role === "super_admin" 
                                  ? "bg-purple-100 text-purple-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                admin.status === "active" 
                                  ? "bg-green-100 text-green-800" 
                                  : admin.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {admin.status || "active"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">Added on {formatDate(admin.createdAt)}</p>
                          </div>
                          {admin.role !== "super_admin" && admin.userId !== adminInfo?.user?._id && (
                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to remove this admin?")) {
                                  removeAdmin({ adminId: admin._id });
                                }
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Admins Found</h3>
                    <p className="text-gray-500">Admin accounts will appear here once created.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Notices</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {notices?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Notices</h3>
                <p className="text-3xl font-bold text-green-600">
                  {notices?.filter(n => n.isActive).length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Teachers</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {teachers?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gallery Photos</h3>
                <p className="text-3xl font-bold text-pink-600">
                  {gallery?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Messages</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {chatMessages?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unread Messages</h3>
                <p className="text-3xl font-bold text-red-600">
                  {chatMessages?.filter(m => !m.isRead).length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Admins</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {allAdmins?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Requests</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingAdmins?.length || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
