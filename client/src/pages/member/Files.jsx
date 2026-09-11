import { Card } from "../../components/ui/Card";
import { Upload, Search, Grid3x3, List, Download, Share2, Trash2, MoreVertical, FileText, Image, File, X, CheckCircle2, FolderOpen, Folder } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { getFilesOfUser, getInvolvedProjects, uploadFileOfMember } from "../../services/member.services";
import { formatBytes } from "../../hooks/parseBytesData";
import { getRelativeTime } from "../../hooks/relativeTime";

const initialFiles = [
  { id: 1, name: "Homepage Design.fig", type: "design", size: "2.4 MB", modified: "2 hours ago", author: "Emily Davis" },
  { id: 2, name: "Project Brief.pdf", type: "document", size: "856 KB", modified: "1 day ago", author: "Mike Chen" },
  { id: 3, name: "API Documentation.docx", type: "document", size: "1.2 MB", modified: "3 days ago", author: "John Smith" },
  { id: 4, name: "Brand Guidelines.pdf", type: "document", size: "5.8 MB", modified: "1 week ago", author: "Sarah Johnson" },
  { id: 5, name: "Wireframes.sketch", type: "design", size: "3.2 MB", modified: "2 weeks ago", author: "Emily Davis" },
  { id: 6, name: "Sprint Planning.xlsx", type: "spreadsheet", size: "445 KB", modified: "3 weeks ago", author: "Lisa Wong" },
  { id: 7, name: "Team Photo.png", type: "image", size: "1.8 MB", modified: "1 month ago", author: "David Miller" },
  { id: 8, name: "Meeting Notes.docx", type: "document", size: "128 KB", modified: "1 month ago", author: "Mike Chen" },
];

const typeIcon = {
  design: Image,
  document: FileText,
  spreadsheet: File,
  image: Image,
};

const typeColor = {
  design: "bg-violet-100 text-violet-600",
  document: "bg-blue-100 text-blue-600",
  spreadsheet: "bg-emerald-100 text-emerald-600",
  image: "bg-amber-100 text-amber-600",
};

const typeLabels = {
  design: "Design",
  document: "Document",
  spreadsheet: "Spreadsheet",
  image: "Image",
};

const Files = ({ role })=> {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [showActions, setShowActions] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Files");
  const [showUpload, setShowUpload] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("document");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [includedInProjects, setIncludedInProjects] = useState([]);
  const [project, setProject] = useState("");

  const filtered = files.filter((f) => {
    const matchSearch = f.fileName.toLowerCase().includes(search.toLowerCase()) || f.uploadedBy?.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All Files" ||
      (typeFilter === "Documents" && f.fileType === "document") ||
      (typeFilter === "Images" && (f.fileType === "image" || f.type === "design")) ||
      (typeFilter === "Spreadsheets" && f.fileType === "spreadsheet") ||
      (typeFilter === "Design Files" && f.fileType === "design");
    return matchSearch && matchType;
  });

  useEffect(()=>{
    getFilesData();
    getInvolvedProjectsData();
  },[])

  const getFilesData = async()=>{
    try {
      const result = await getFilesOfUser();
      setFiles(result?.data);

    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  }

  const getInvolvedProjectsData = async()=>{
    try {
      const result = await getInvolvedProjects();
      setIncludedInProjects(result?.data);

    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  }

  const deleteFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setShowActions(null);
  };

  const addFile = async() => {
    if (!fileName.trim() || !file) return;
    try {
      setIsUploading(true);
      const formData = new FormData()
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("fileType", fileType);
      formData.append("project", project);

      const res = await uploadFileOfMember( formData );

      setFiles((prev)=>[...prev,res?.data]);
      
      setShowUpload(false);
      setIsUploading(false);
      setFile(null);
      setFileName("");
      setFileType("document");
      setProject("");
      toast.success("File uploaded successfullly");

    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      console.log(e.dataTransfer.files);
    }
  };

  const totalSize = files.reduce((acc, f) => {
    const formattedBytes = formatBytes(f.size);
    const num = parseFloat(formattedBytes);
    const unit = formattedBytes.includes("MB") ? 1 : 0.001;
    return acc + (isNaN(num) ? 0 : num * unit);

  }, 0);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Files</h1>
          <p className="text-gray-600">{files.length} files · {totalSize.toFixed(1)} MB total</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option>All Files</option>
              <option>Documents</option>
              <option>Design Files</option>
              <option>Images</option>
              <option>Spreadsheets</option>
            </select>
            <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          {filtered.length !== files.length && (
            <p className="text-xs text-gray-400 mt-2">Showing {filtered.length} of {files.length} files</p>
          )}
        </div>

        <div className="p-5">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No files found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search or filter</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((file, idx) => {
                const Icon = typeIcon[file.fileType];
                return (
                  <div
                    key={file._id || idx}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group"
                  >
                    {file.project?.title && (
                            <div 
                            title="From project"
                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2.5">
                              <Folder className="w-3.5 h-3.5 text-gray-400" />
                              <span className="truncate">{file.project?.title}</span>
                            </div>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColor[file.fileType]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === file._id ? null : file._id)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showActions === file._id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-10">
                            <button
                              onClick={() => { setShowActions(null);}}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" /> Download
                            </button>
                            <button
                              onClick={() => { setShowActions(null);}}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" /> Share
                            </button>
                            {(role === "admin" || role === "manager") && (
                              <>
                                <div className="my-1 border-t border-gray-100" />
                                <button
                                  onClick={() => deleteFile(file._id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{file.fileName}</h4>
                    <p className="text-xs text-gray-500 mb-2">{formatBytes(file.size)}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-6 h-6 bg-linear-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                        <span 
                         title={`Uploaded By: ${file.uploadedBy?.name}`}
                         className="text-white text-[9px] font-bold">{file.uploadedBy?.name?.substring(0, 2).toUpperCase()}</span>
                      </div>
                      {getRelativeTime(file.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((file, idx) => {
                const Icon = typeIcon[file.fileType];
                return ( 
                  <div key={file._id || idx} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeColor[file.fileType]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{file.fileName}</p>
                      <p className="text-xs text-gray-500">{file.uploadedBy?.name} · {getRelativeTime(file.createdAt)}</p>
                    </div>
                    <span className="text-xs text-gray-400 hidden sm:block">{typeLabels[file.fileType]}</span>
                    <span className="text-sm text-gray-500 w-16 text-right">{formatBytes(file.size)}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      {(role === "admin" || role === "manager") && (
                        <button
                          onClick={() => deleteFile(file._id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Upload File</h3>
              <button onClick={() => setShowUpload(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`block border-2 border-dashed select-none rounded-xl p-8 text-center transition-colors cursor-pointer 
                  ${isDragging 
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-blue-400"
                  }`}
              >
                <input 
                  type="file" 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }} 
                />

                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
      
                <p className="text-sm font-medium text-gray-700">
                  {file ? file.name : "Click to browse or drag file here"}
                </p>
      
                <p className="text-xs text-gray-400 mt-1">Max 50 MB per file</p>
              </label>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">File Name</label>
                <input
                  autoFocus
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="filename.ext"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">File Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="document">Document</option>
                  <option value="design">Design File</option>
                  <option value="image">Image</option>
                  <option value="spreadsheet">Spreadsheet</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">In Project</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select Project</option>
                  {
                    includedInProjects.map((project,idx)=>(
                      <option key={project._id || idx } value={project._id}>{project.title}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFile}
                disabled={!fileName.trim() || !file}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                {isUploading ? "Uploading...": "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Files;