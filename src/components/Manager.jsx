import React, { useState, useEffect } from "react";
// Toastify for notifications
import { ToastContainer, toast, Bounce } from "react-toastify";
// UUID for generating unique IDs
import { v4 as uuidv4 } from "uuid";
// Clerk for user authentication
import { useUser } from "@clerk/clerk-react";
// Icons from react-icons
import {
  FaUser,
  FaKey,
  FaGlobe,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaCheck,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

const API_BASE_URL = "https://password-manager-backend-passop.onrender.com";

const Manager = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  // State to toggle show/hide password
  const [showPassword, setShowPassword] = useState(false);
  // State to manage form fields
  const [form, setform] = useState({ site: "", username: "", password: "" });
  // State to hold all saved passwords
  const [passwordArray, setPasswordArray] = useState([]);
  // Tracks which field was copied to clipboard
  const [copiedField, setCopiedField] = useState(null);
  // Used to track the ID of password being edited
  const [editingIndex, setEditingIndex] = useState(null);
  // Used to track the ID of password marked for deletion
  const [deleteIndex, setDeleteIndex] = useState(null);
  // Controls visibility of delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || !user?.id) {
    return <div>Please sign in to access your passwords.</div>;
  }

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Id': user?.id
  });

  const fetchApi = async (method, body = null) => {
    if (!isSignedIn || !user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const options = {
        method,
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'same-origin'
      };

      if (body) {
        options.body = JSON.stringify({
          ...body,
          userId: user.id
        });
      }

      console.log(`Making ${method} request with:`, {
        url: API_BASE_URL,
        options: {
          ...options,
          headers: { ...options.headers },
          body: options.body ? JSON.parse(options.body) : undefined
        }
      });

      const response = await fetch(API_BASE_URL, options);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      if (method === 'DELETE') {
        return { success: response.ok };
      }
      
      const data = await response.json();
      console.log('Received data from server:', data);
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Fetch passwords from backend when component mounts
  const getPasswords = async () => {
    if (!isSignedIn || !user?.id) {
      console.log('No authenticated user, skipping password fetch');
      setPasswordArray([]);
      return;
    }
    
    try {
      console.log('Fetching passwords for user:', user.id);
      const data = await fetchApi('GET');
      
      if (Array.isArray(data)) {
        // Filter passwords to only include those belonging to current user
        // and ensure they have all required fields
        const validPasswords = data.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            item.userId === user.id && // Strict user check
            item.site &&
            item.username &&
            item.password
        );
        console.log('Filtered passwords for current user:', validPasswords.length);
        setPasswordArray(validPasswords);
      } else {
        console.error('Invalid data format received:', data);
        setPasswordArray([]);
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
      toast.error('Failed to load passwords. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      setPasswordArray([]);
    }
  };

  // Fetch passwords when authentication state changes
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      console.log('User authenticated, fetching passwords');
      getPasswords();
    } else {
      console.log('User not authenticated, clearing passwords');
      setPasswordArray([]); // Clear passwords when not authenticated
    }
  }, [isLoaded, isSignedIn, user?.id]);

  // Save or update password
  const handleSavePassword = async () => {
    if (!isSignedIn || !user?.id) {
      toast.error("❌ Please sign in to save passwords!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    // Input validation
    if (!form.site.trim() || !form.username.trim() || !form.password.trim()) {
      toast.error("❌ Please fill in all fields before saving!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (editingIndex !== null) {
      // Update in backend first
      const updatedPassword = await fetchApi("PUT", { 
        ...form, 
        _id: editingIndex,
        userId: user.id 
      });

      // Update local state with the response from backend
      const updatedPasswords = passwordArray.map((item) =>
        item._id === editingIndex ? updatedPassword : item
      );
      setPasswordArray(updatedPasswords);

      setEditingIndex(null);
      setform({ site: "", username: "", password: "" });
      toast.info("✅ Password updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } else {
      // Add new password with userId
      const newPassword = { ...form, userId: user.id };
      
      // Save in backend first to get the proper _id
      const savedPassword = await fetchApi("POST", newPassword);
      
      // Update local state with the saved password
      setPasswordArray([...passwordArray, savedPassword]);

      setform({ site: "", username: "", password: "" });
      toast.success("✅ Password saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  // Update form fields as user types
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  // Copy specific field value to clipboard
  const copyToClipboard = async (text, fieldType, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(`${fieldType}-${index}`);
      setTimeout(() => setCopiedField(null), 2000);

      toast.info("Copied to clipboard!", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
        transition: Bounce,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Load a password entry into form for editing
  const handleEdit = (_id) => {
    const targetItem = passwordArray.find((item) => item._id === _id);
    if (!targetItem) {
      toast.error("❌ Password not found for editing.");
      return;
    }

    setform({
      site: targetItem.site,
      username: targetItem.username,
      password: targetItem.password,
    });

    setEditingIndex(_id); // store MongoDB _id
    toast.info("✏️ Password loaded for editing!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  };

  // Show modal to confirm delete
  const handleDelete = (passwordId) => {
    console.log('Attempting to delete password with ID:', passwordId);
    // Convert to string if it's an ObjectId
    const idToDelete = typeof passwordId === 'object' ? passwordId.toString() : passwordId;
    setDeleteIndex(idToDelete);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteIndex) {
        throw new Error("No password selected for deletion");
      }

      console.log('Deleting password with ID:', deleteIndex);

      // Send delete request
      const options = {
        method: 'DELETE',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          _id: deleteIndex,
          userId: user.id
        })
      };

      const response = await fetch(API_BASE_URL, options);
      const result = await response.json();

      if (result.success) {
        setPasswordArray(prevPasswords => 
          prevPasswords.filter(item => item._id !== deleteIndex)
        );
        toast.success("✅ Password deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        // Refresh the password list
        getPasswords();
      } else {
        throw new Error(result.message || "Failed to delete password");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`❌ ${error.message || "Error deleting password"}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  // Cancel delete modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteIndex(null);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <div className="container mx-auto max-w-4xl lg:max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="relative rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20 overflow-hidden">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-purple-500 via-blue-400 to-pink-400 opacity-60 blur-lg z-[-1] "></div>
          <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
            <span className="text-blue-600">&lt;</span>
            Pass
            <span className="text-blue-600">OP/&gt;</span>
          </h1>
          <p className="text-white/70 mb-6 text-base sm:text-lg text-center">
            Securely store and manage your passwords.
          </p>
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                <FaGlobe />
              </span>
              <input
                value={form.site}
                onChange={handleChange}
                type="text"
                name="site"
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
                placeholder="Website or App Name"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FaUser />
                </span>
                <input
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                  name="username"
                  className="pl-10 pr-4 py-3 w-full rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
                  placeholder="Username"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  <FaKey />
                </span>
                <input
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="pl-10 pr-12 py-3 w-full rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-inner text-sm sm:text-base"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-blue-400 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSavePassword}
                className="mt-4 py-2 px-6 sm:px-8 rounded-lg bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300/40 w-auto min-w-0"
              >
                {editingIndex !== null ? "Update Password" : "Save Password"}
              </button>
            </div>
          </div>

          {/* Passwords Table */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mt-8 sm:mt-10 mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            Your Passwords
          </h2>
          <div className="mt-6 sm:mt-10 overflow-x-auto rounded-xl shadow-lg">
            <table className="min-w-full bg-white/10 backdrop-blur-md text-white rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 text-white">
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Website/App
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Password
                    
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {passwordArray.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-white/60 text-sm sm:text-base"
                    >
                      No passwords saved yet.
                    </td>
                  </tr>
                ) : (
                  passwordArray
                    .filter(
                      (item) =>
                        item && item.site && item.username && item.password
                    )
                    .map((item, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white/5 even:bg-white/0 hover:bg-blue-900/30 transition"
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <a
                              href={
                                item?.site?.startsWith("http")
                                  ? item.site
                                  : `https://${item.site}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm truncate max-w-20 sm:max-w-32 lg:max-w-48 text-blue-300 hover:text-blue-200 underline hover:no-underline transition-colors duration-200"
                              title={`Visit ${item?.site || "N/A"}`}
                            >
                              {item?.site || "N/A"}
                            </a>
                            <button
                              onClick={() =>
                                copyToClipboard(item?.site || "", "site", idx)
                              }
                              className="ml-2 p-1 rounded bg-blue-600/70 hover:bg-blue-500/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 flex-shrink-0"
                              title="Copy website"
                            >
                              {copiedField === `site-${idx}` ? (
                                <FaCheck className="text-green-400 text-xs sm:text-sm" />
                              ) : (
                                <FaCopy className="text-white text-xs sm:text-sm" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm truncate max-w-20 sm:max-w-32 lg:max-w-48">
                              {item?.username || "N/A"}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item?.username || "",
                                  "username",
                                  idx
                                )
                              }
                              className="ml-2 p-1 rounded bg-blue-600/70 hover:bg-blue-500/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 flex-shrink-0"
                              title="Copy username"
                            >
                              {copiedField === `username-${idx}` ? (
                                <FaCheck className="text-green-400 text-xs sm:text-sm" />
                              ) : (
                                <FaCopy className="text-white text-xs sm:text-sm" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <span className="font-mono select-all text-xs sm:text-sm truncate max-w-20 sm:max-w-32 lg:max-w-48">
                              {item?.password || "N/A"}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  item?.password || "",
                                  "password",
                                  idx
                                )
                              }
                              className="ml-2 p-1 rounded bg-blue-600/70 hover:bg-blue-500/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 flex-shrink-0"
                              title="Copy password"
                            >
                              {copiedField === `password-${idx}` ? (
                                <FaCheck className="text-green-400 text-xs sm:text-sm" />
                              ) : (
                                <FaCopy className="text-white text-xs sm:text-sm" />
                              )}
                            </button>
                            
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="p-1 sm:p-2 rounded bg-blue-600/70 hover:bg-blue-500/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                              title="Edit password"
                            >
                              <FaEdit className="text-white text-xs sm:text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1 sm:p-2 rounded bg-red-600/70 hover:bg-red-500/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                              title="Delete password"
                            >
                              <FaTrash className="text-white text-xs sm:text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && cancelDelete()}
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div 
            className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-white/20"
            role="alertdialog"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 id="modal-title" className="text-lg font-medium text-white mb-2">
                Delete Password
              </h3>
              <p id="modal-description" className="text-white/70 mb-6">
                Are you sure you want to delete this password? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg bg-gray-600/70 hover:bg-gray-500/80 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/40"
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600/70 hover:bg-red-500/80 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Manager;
