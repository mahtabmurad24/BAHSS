import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function AdminPanel({ adminCode }: { adminCode: string }) {
  const [activeTab, setActiveTab] = useState("notices");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any>(null);
  const [editingChatMessage, setEditingChatMessage] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; type: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teacherImageUrls, setTeacherImageUrls] = useState<{ [key: string]: string | null }>({});
  const [galleryImageUrls, setGalleryImageUrls] = useState<{ [key: string]: string | null }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState({
    name: "",
    designation: "",
    department: "",
    qualification: "",
    experience: "",
    email: "",
    phone: "",
    bio: "",
    order: 0,
  });
  const [galleryFormData, setGalleryFormData] = useState({
    title: "",
    description: "",
    category: "",
    isVisible: true,
  });
  const [noticeFormData, setNoticeFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as "high" | "medium" | "low",
    isActive: true,
  });
  const [chatReply, setChatReply] = useState("");

  // Updated queries without adminId
  const notices = useQuery(api.notices.getAllNotices);
  const teachers = useQuery(api.teachers.getAllTeachers, { code: adminCode });
  const gallery = useQuery(api.gallery.getAllGallery);
  const chatMessages = useQuery(api.chat.getAllChats, { code: adminCode });

  // Updated mutations without adminId
  const getStorageUrl = useMutation(api.storage.getUrl);
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
  const replyToChat = useMutation(api.chat.replyToChat);
  const markChatAsRead = useMutation(api.chat.markChatAsRead);

  // Fetch image URLs
  useEffect(() => {
    const fetchImages = async () => {
      if (teachers) {
        const urls: { [key: string]: string | null } = {};
        for (const teacher of teachers) {
          if (teacher.imageId) {
            urls[teacher._id] = await getStorageUrl({ storageId: teacher.imageId });
          }
        }
        setTeacherImageUrls(urls);
      }

      if (gallery) {
        const urls: { [key: string]: string | null } = {};
        for (const item of gallery) {
          if (item.imageId) {
            urls[item._id] = await getStorageUrl({ storageId: item.imageId });
          }
        }
        setGalleryImageUrls(urls);
      }
    };
    fetchImages();
  }, [teachers, gallery, getStorageUrl]);

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent("closeAdminPanel"));
  };

  const handleViewWebsite = () => {
    window.dispatchEvent(new CustomEvent("showAdminModal", { detail: { show: true } }));
  };

  // NOTICE HANDLERS
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingNotice) {
        await updateNotice({
          noticeId: editingNotice._id,
          title: noticeFormData.title,
          content: noticeFormData.content,
          priority: noticeFormData.priority,
          isActive: noticeFormData.isActive,
        });
        toast.success("Notice updated successfully!");
      } else {
        await createNotice({
          title: noticeFormData.title,
          content: noticeFormData.content,
          priority: noticeFormData.priority,
        });
        toast.success("Notice added successfully!");
      }
      setNoticeFormData({
        title: "",
        content: "",
        priority: "medium",
        isActive: true,
      });
      setShowCreateForm(false);
      setEditingNotice(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId: Id<"notices">) => {
    setIsLoading(true);
    try {
      await deleteNotice({ noticeId });
      toast.success("Notice deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // TEACHER HANDLERS
  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageId: Id<"_storage"> | undefined;
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
        code: adminCode,
        teacherId: editingTeacher._id,
        ...teacherFormData,
        ...(imageId && { imageId }),
      });
        toast.success("Teacher updated successfully!");
      } else {
      await addTeacher({
        code: adminCode,
        createdAt: Date.now(),
        ...teacherFormData,
        ...(imageId && { imageId }),
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
        order: 0,
      });
      setSelectedFile(null);
      setShowCreateForm(false);
      setEditingTeacher(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId: Id<"teachers">) => {
    setIsLoading(true);
    try {
      await deleteTeacher({ code: adminCode, teacherId });
      toast.success("Teacher deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // GALLERY HANDLERS
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let imageId: Id<"_storage"> | undefined;
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

      if (editingGalleryItem) {
        await updateGalleryItem({
          itemId: editingGalleryItem._id,
          ...galleryFormData,
        });
        toast.success("Gallery item updated successfully!");
      } else {
        if (!imageId) throw new Error("Image is required");
        await addGalleryItem({
          title: galleryFormData.title,
          description: galleryFormData.description,
          category: galleryFormData.category,
          imageId,
        });
        toast.success("Gallery item added successfully!");
      }
      setGalleryFormData({
        title: "",
        description: "",
        category: "",
        isVisible: true,
      });
      setSelectedFile(null);
      setShowCreateForm(false);
      setEditingGalleryItem(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleDeleteGalleryItem = async (itemId: Id<"gallery">) => {
    setIsLoading(true);
    try {
      await deleteGalleryItem({ itemId });
      toast.success("Gallery item deleted successfully!");
      setShowDeleteConfirm(null);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // CHAT HANDLERS
  const handleReplyChatMessage = async (chatId: Id<"chat">) => {
    setIsLoading(true);
    try {
      await replyToChat({
        code: adminCode,
        chatId,
        reply: chatReply,
      });
      toast.success("Reply sent successfully!");
      setEditingChatMessage(null);
      setChatReply("");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkChatAsRead = async (chatId: Id<"chat">) => {
    setIsLoading(true);
    try {
      await markChatAsRead({ code: adminCode, chatId });
      toast.success("Message marked as read!");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Panel
          </h1>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleViewWebsite}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              title="View Website"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              title="Close Panel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4 sm:space-x-6 overflow-x-auto">
            {["notices", "teachers", "gallery", "chat"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setShowCreateForm(false);
                  setEditingNotice(null);
                  setEditingTeacher(null);
                  setEditingGalleryItem(null);
                  setEditingChatMessage(null);
                  setError(null);
                }}
                className={`px-4 py-2 font-medium text-sm sm:text-base capitalize transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {(notices === undefined || teachers === undefined || gallery === undefined || chatMessages === undefined) && (
          <div className="mb-6 p-4 bg-gray-100 text-gray-700 rounded-lg">Loading...</div>
        )}

        {/* Notices Tab */}
        {activeTab === "notices" && notices !== undefined && (
          <div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
              disabled={isLoading}
            >
              Add Notice
            </button>
            {showCreateForm && (
              <form onSubmit={handleNoticeSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={noticeFormData.title}
                      onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={noticeFormData.priority}
                      onChange={(e) =>
                        setNoticeFormData({ ...noticeFormData, priority: e.target.value as "high" | "medium" | "low" })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoading}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={noticeFormData.content}
                      onChange={(e) => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                    <input
                      type="checkbox"
                      checked={noticeFormData.isActive}
                      onChange={(e) => setNoticeFormData({ ...noticeFormData, isActive: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : editingNotice ? "Update" : "Create"} Notice
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingNotice(null);
                      setNoticeFormData({ title: "", content: "", priority: "medium", isActive: true });
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {!showCreateForm && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Active</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((notice) => (
                      <tr key={notice._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{notice.title}</td>
                        <td className="p-4 text-gray-600">{notice.priority}</td>
                        <td className="p-4 text-gray-600">{notice.isActive ? "Yes" : "No"}</td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setEditingNotice(notice);
                              setNoticeFormData({
                                title: notice.title,
                                content: notice.content,
                                priority: notice.priority,
                                isActive: notice.isActive,
                              });
                              setShowCreateForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ id: notice._id, type: "notice" })}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === "teachers" && teachers !== undefined && (
          <div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
              disabled={isLoading}
            >
              Add Teacher
            </button>
            {showCreateForm && (
              <form onSubmit={handleTeacherSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={teacherFormData.name}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={teacherFormData.designation}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, designation: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={teacherFormData.department}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    >
                      <option value="">Select Department</option>
                      <option value="Science">Science</option>
                      <option value="Arts">Arts</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="English">English</option>
                      <option value="Bangla">Bangla</option>
                      <option value="Religion">Religion</option>
                      <option value="ICT">ICT</option>
                      <option value="Physical Education">Physical Education</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      value={teacherFormData.qualification}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, qualification: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={teacherFormData.experience}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, experience: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={teacherFormData.email}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={teacherFormData.phone}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <input
                      type="number"
                      value={teacherFormData.order}
                      onChange={(e) =>
                        setTeacherFormData({ ...teacherFormData, order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={teacherFormData.bio}
                      onChange={(e) => setTeacherFormData({ ...teacherFormData, bio: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      disabled={isLoading || isUploading}
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading || isUploading}
                  >
                    {isUploading ? "Uploading..." : isLoading ? "Saving..." : editingTeacher ? "Update" : "Create"} Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
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
                        order: 0,
                      });
                      setSelectedFile(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading || isUploading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {!showCreateForm && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Designation</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Department</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Active</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{teacher.name}</td>
                        <td className="p-4 text-gray-600">{teacher.designation}</td>
                        <td className="p-4 text-gray-600">{teacher.department}</td>
                        <td className="p-4 text-gray-600">{teacher.isActive ? "Yes" : "No"}</td>
                        <td className="p-4">
                          <button
                            onClick={() => {
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
                                order: teacher.order,
                              });
                              setShowCreateForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ id: teacher._id, type: "teacher" })}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && gallery !== undefined && (
          <div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
              disabled={isLoading}
            >
              Add Gallery Item
            </button>
            {showCreateForm && (
              <form onSubmit={handleGallerySubmit} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={galleryFormData.title}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={galleryFormData.category}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={isLoading || isUploading}
                    >
                      <option value="">Select Category</option>
                      <option value="events">Events</option>
                      <option value="campus">Campus</option>
                      <option value="activities">Activities</option>
                      <option value="achievements">Achievements</option>
                      <option value="sports">Sports</option>
                      <option value="facilities">Facilities</option>
                      <option value="ceremonies">Ceremonies</option>
                      <option value="workshops">Workshops</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={galleryFormData.description}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visible</label>
                    <input
                      type="checkbox"
                      checked={galleryFormData.isVisible}
                      onChange={(e) => setGalleryFormData({ ...galleryFormData, isVisible: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isLoading || isUploading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      required={!editingGalleryItem}
                      disabled={isLoading || isUploading}
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading || isUploading}
                  >
                    {isUploading ? "Uploading..." : isLoading ? "Saving..." : editingGalleryItem ? "Update" : "Create"} Gallery Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingGalleryItem(null);
                      setGalleryFormData({ title: "", description: "", category: "", isVisible: true });
                      setSelectedFile(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading || isUploading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {!showCreateForm && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Visible</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Image</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gallery.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-gray-900">{item.title}</td>
                        <td className="p-4 text-gray-600">{item.category}</td>
                        <td className="p-4 text-gray-600">{item.isVisible ? "Yes" : "No"}</td>
                        <td className="p-4">
                          {galleryImageUrls[item._id] ? (
                            <img
                              src={galleryImageUrls[item._id]!}
                              alt={item.title}
                              className="h-16 w-16 object-cover rounded-md shadow-sm"
                            />
                          ) : (
                            <span className="text-gray-500">No Image</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setEditingGalleryItem(item);
                              setGalleryFormData({
                                title: item.title,
                                description: item.description || "",
                                category: item.category,
                                isVisible: item.isVisible,
                              });
                              setShowCreateForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({ id: item._id, type: "gallery" })}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && chatMessages !== undefined && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Message</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                      {chatMessages.map((message) => (
                        <tr key={message._id} className="border-b hover:bg-gray-50">
                          <td className="p-4 text-gray-900">{message.name}</td>
                          <td className="p-4 text-gray-600">{message.email}</td>
                          <td className="p-4 text-gray-600">{message.message}</td>
                          <td className="p-4 text-gray-600">
                            {message.isReplied ? "Replied" : message.isRead ? "Read" : "Unread"}
                          </td>
                          <td className="p-4">
                            {!message.isRead && (
                              <button
                                onClick={() => handleMarkChatAsRead(message._id)}
                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                                disabled={isLoading}
                              >
                                Mark as Read
                              </button>
                            )}
                            {!message.isReplied && (
                              <button
                                onClick={() => setEditingChatMessage(message)}
                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                                disabled={isLoading}
                              >
                                Reply
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            {editingChatMessage && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Reply to {editingChatMessage.name}
                </h3>
                <textarea
                  value={chatReply}
                  onChange={(e) => setChatReply(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Type your reply..."
                  disabled={isLoading}
                />
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleReplyChatMessage(editingChatMessage._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reply"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingChatMessage(null);
                      setChatReply("");
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {showDeleteConfirm.type}?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    if (showDeleteConfirm.type === "notice") {
                      await handleDeleteNotice(showDeleteConfirm.id as Id<"notices">);
                    } else if (showDeleteConfirm.type === "teacher") {
                      await handleDeleteTeacher(showDeleteConfirm.id as Id<"teachers">);
                    } else if (showDeleteConfirm.type === "gallery") {
                      await handleDeleteGalleryItem(showDeleteConfirm.id as Id<"gallery">);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}