// src/components/UploadForm/Step1Form.jsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/categories`;
const BASE_URL = import.meta.env.VITE_API_URL; // e.g. http://localhost:5005 - only for display

const Step1Form = ({
  onNext,
  formData = {},
  setFormData,
  isUpdate = false,
  apkId,
}) => {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(false);
  const { user } = useAuth();

  // Preview states - full URLs for display
  const [logoPreview, setLogoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [screenshotsPreview, setScreenshotsPreview] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      apkTitle: "",
      appCategory: "",
      shortDescription: "",
      requiresGoogleRestrictions: false,
      appPlatform: "",
      websiteUrl: "",
      apkVersion: "",
      tagInput: "",
      apkLogo: null,
      uploadVideo: null,
      apkFile: null,
      screenshots: [],
    },
  });

  const requiresGoogleRestrictions = watch("requiresGoogleRestrictions");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(API_BASE);
        setCategories(response.data || []);
        setCategoryError(false);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoryError(true);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Pre-fill form + set previews
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      // Text fields
      setValue("apkTitle", formData.apkTitle || "");
      setValue("appCategory", formData.appCategory || "");
      setValue("shortDescription", formData.shortDescription || "");
      setValue(
        "requiresGoogleRestrictions",
        !!formData.requiresGoogleRestrictions
      );
      setValue("appPlatform", formData.appPlatform || "");
      setValue("websiteUrl", formData.websiteUrl || "");
      setValue("apkVersion", formData.apkVersion || "");

      // Tags
      if (Array.isArray(formData.tags) && formData.tags.length > 0) {
        setTags(formData.tags);
      }

      // Set preview URLs (display only) - do NOT touch actual file fields
      if (isUpdate) {
        if (formData.apkLogo && typeof formData.apkLogo === "string") {
          setLogoPreview(`${BASE_URL}${formData.apkLogo}`);
        }
        if (formData.uploadVideo && typeof formData.uploadVideo === "string") {
          setVideoPreview(`${BASE_URL}${formData.uploadVideo}`);
        }
        if (
          Array.isArray(formData.screenshots) &&
          formData.screenshots.length > 0
        ) {
          setScreenshotsPreview(
            formData.screenshots.map((s) => `${BASE_URL}${s}`)
          );
        }
      }
    }
  }, [formData, setValue, isUpdate]);

  const addTag = () => {
    const tagInput = getValues("tagInput")?.trim();
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setValue("tagInput", "");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onSubmitStep1 = async (data) => {
    if (tags.length < 5) {
      alert("Minimum 5 tags required!");
      return;
    }

    const hasExistingScreenshots =
      isUpdate &&
      Array.isArray(formData.screenshots) &&
      formData.screenshots.length >= 4;
    const currentScreenshotsCount = (data.screenshots || []).length;

    if (
      !hasExistingScreenshots &&
      (currentScreenshotsCount < 4 || currentScreenshotsCount > 12)
    ) {
      alert("You must upload between 4 and 12 screenshots!");
      return;
    }

    const validated = await trigger();
    if (!validated) return;

    // Preserve old relative paths if no new files
    const step1Data = {
      ...data,
      tags,
      apkLogo:
        data.apkLogo instanceof File
          ? data.apkLogo
          : isUpdate
          ? formData.apkLogo
          : null,
      uploadVideo:
        data.uploadVideo instanceof File
          ? data.uploadVideo
          : isUpdate
          ? formData.uploadVideo
          : null,
      apkFile:
        data.apkFile instanceof File
          ? data.apkFile
          : isUpdate
          ? formData.apkFile
          : null,
      screenshots:
        currentScreenshotsCount > 0
          ? data.screenshots
          : isUpdate
          ? formData.screenshots
          : [],
    };

    if (setFormData) {
      setFormData((prev) => ({ ...prev, ...step1Data }));
    }

    onNext(step1Data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-orange-800/40"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
        {isUpdate ? "Update App Details – Step 1" : "Step 1 – App Details"}
      </h2>

      <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-10">
        {/* APK Title */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            APK Title
          </label>
          <Controller
            name="apkTitle"
            control={control}
            rules={{ required: "APK Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="e.g. My Awesome App"
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
            )}
          />
          {errors.apkTitle && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.apkTitle.message}
            </p>
          )}
        </div>

        {/* App Category */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            App Category
          </label>
          <Controller
            name="appCategory"
            control={control}
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <select
                {...field}
                disabled={loadingCategories || categoryError}
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 cursor-pointer disabled:opacity-60"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : categoryError
                    ? "Failed to load categories"
                    : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.appCategory && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.appCategory.message}
            </p>
          )}
          {categoryError && (
            <p className="text-red-400 mt-2 text-sm">
              Could not load categories. Please try again later.
            </p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Short Description
          </label>
          <Controller
            name="shortDescription"
            control={control}
            rules={{ required: "Short description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={5}
                placeholder="Briefly describe your app..."
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 resize-none"
              />
            )}
          />
          {errors.shortDescription && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* APK Logo */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            APK Logo (Image Only)
          </label>
          <Controller
            name="apkLogo"
            control={control}
            rules={{ required: !isUpdate && "App logo is required" }}
            render={({ field: { onChange } }) => (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoPreview(URL.createObjectURL(file)); // preview new upload
                    }
                    onChange(file || null);
                  }}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl file:mr-6 file:py-4 file:px-10 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-600 file:to-orange-500 file:text-white file:font-bold cursor-pointer transition"
                />
                {logoPreview && (
                  <div className="mt-6 relative inline-block">
                    <img
                      src={logoPreview}
                      alt="App Logo Preview"
                      className="w-40 h-40 object-cover rounded-3xl border-4 border-orange-500/50 shadow-2xl"
                      onError={(e) => (e.target.src = "/placeholder-logo.png")}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onChange(null);
                        setLogoPreview(null);
                      }}
                      className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg cursor-pointer transition"
                    >
                      <AiOutlineClose className="text-white text-xl" />
                    </button>
                  </div>
                )}
              </>
            )}
          />
          {errors.apkLogo && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.apkLogo.message}
            </p>
          )}
        </div>

        {/* Google Restrictions */}
        <div className="flex items-center gap-6">
          <label className="text-xl font-semibold text-orange-300">
            Does your app require any Google restrictions?
          </label>
          <Controller
            name="requiresGoogleRestrictions"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                {...field}
                checked={field.value}
                className="w-8 h-8 accent-orange-500 rounded cursor-pointer"
              />
            )}
          />
        </div>

        {/* Video Upload */}
        {requiresGoogleRestrictions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-xl font-semibold text-orange-300 mb-3">
              Upload Video (Max 25MB)
            </label>
            <Controller
              name="uploadVideo"
              control={control}
              rules={{
                required:
                  requiresGoogleRestrictions &&
                  !isUpdate &&
                  "Video is required",
              }}
              render={({ field: { onChange } }) => (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setVideoPreview(URL.createObjectURL(file));
                      }
                      if (file && file.size > 25 * 1024 * 1024) {
                        alert("Video must be 25MB or smaller");
                        return;
                      }
                      onChange(file || null);
                    }}
                    className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl file:mr-6 file:py-4 file:px-10 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-600 file:to-orange-500 file:text-white file:font-bold cursor-pointer transition"
                  />
                  {videoPreview && (
                    <div className="mt-6 relative inline-block">
                      <video
                        controls
                        className="w-96 rounded-3xl border-4 border-orange-500/50 shadow-2xl"
                      >
                        <source src={videoPreview} />
                        Your browser does not support video playback.
                      </video>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(null);
                          setVideoPreview(null);
                        }}
                        className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 rounded-full p-3 shadow-lg cursor-pointer transition"
                      >
                        <AiOutlineClose className="text-white text-xl" />
                      </button>
                    </div>
                  )}
                </>
              )}
            />
            {errors.uploadVideo && (
              <p className="text-orange-400 mt-2 text-sm">
                {errors.uploadVideo.message}
              </p>
            )}
          </motion.div>
        )}

        {/* Platform */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Your App Platform
          </label>
          <Controller
            name="appPlatform"
            control={control}
            rules={{ required: "Please select a platform" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200 cursor-pointer"
              >
                <option value="">Choose platform</option>
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Both">Both</option>
              </select>
            )}
          />
          {errors.appPlatform && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.appPlatform.message}
            </p>
          )}
        </div>

        {/* APK File */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Upload APK File
          </label>
          <Controller
            name="apkFile"
            control={control}
            rules={{ required: !isUpdate && "APK file is required" }}
            render={({ field: { onChange } }) => (
              <>
                <input
                  type="file"
                  accept=".apk"
                  onChange={(e) => onChange(e.target.files?.[0] || null)}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl file:mr-6 file:py-4 file:px-10 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-600 file:to-orange-500 file:text-white file:font-bold cursor-pointer transition"
                />
                {(formData.apkFile || watch("apkFile")) && (
                  <p className="text-green-400 mt-3 font-medium">
                    ✓{" "}
                    {watch("apkFile") instanceof File
                      ? watch("apkFile").name
                      : "Existing APK file kept"}
                  </p>
                )}
              </>
            )}
          />
          {errors.apkFile && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.apkFile.message}
            </p>
          )}
        </div>

        {/* Screenshots */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Upload Screenshots (Min 4, Max 12)
          </label>
          <Controller
            name="screenshots"
            control={control}
            rules={{ required: !isUpdate && "Screenshots are required" }}
            render={({ field: { onChange, value } }) => (
              <>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const newFiles = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    const updated = [...(value || []), ...newFiles];
                    onChange(updated);

                    // Add temporary previews for new files
                    const newPreviews = newFiles.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setScreenshotsPreview((prev) => [...prev, ...newPreviews]);
                  }}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl file:mr-6 file:py-4 file:px-10 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-orange-600 file:to-orange-500 file:text-white file:font-bold cursor-pointer transition"
                />
                {(value?.length > 0 || screenshotsPreview.length > 0) && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {screenshotsPreview.map((previewUrl, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <img
                          src={previewUrl}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-64 object-cover rounded-3xl border-4 border-orange-500/40 shadow-2xl"
                          onError={(e) =>
                            (e.target.src = "/placeholder-screenshot.png")
                          }
                        />
                        <div className="absolute bottom-3 left-3 bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPreview = screenshotsPreview.filter(
                              (_, i) => i !== index
                            );
                            setScreenshotsPreview(updatedPreview);
                            // Also remove from form value if needed
                            const updatedFiles =
                              value?.filter((_, i) => i !== index) || [];
                            onChange(updatedFiles);
                          }}
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 rounded-full p-3 opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-lg"
                        >
                          <AiOutlineClose className="text-white text-xl" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
          {errors.screenshots && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.screenshots.message}
            </p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Website URL (Optional)
          </label>
          <Controller
            name="websiteUrl"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="url: https://example.com"
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
            )}
          />
          {errors.websiteUrl && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>

        {/* APK Version */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            APK Version
          </label>
          <Controller
            name="apkVersion"
            control={control}
            rules={{ required: "Version number is required" }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="e.g. 1.0.5"
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
              />
            )}
          />
          {errors.apkVersion && (
            <p className="text-orange-400 mt-2 text-sm">
              {errors.apkVersion.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xl font-semibold text-orange-300 mb-3">
            Tags (Minimum 5)
          </label>
          <div className="flex gap-4 mb-6">
            <Controller
              name="tagInput"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type tag and press Enter"
                  className="flex-1 px-6 py-5 bg-gray-800/70 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition duration-200"
                />
              )}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-10 py-5 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl font-bold shadow-xl hover:shadow-orange-900/60 transition cursor-pointer"
            >
              <AiOutlinePlus className="text-3xl" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {tags.map((tag, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3 px-6 py-4 bg-orange-900/40 rounded-2xl border border-orange-600/50 shadow-lg"
              >
                <span className="font-medium text-orange-200">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </motion.div>
            ))}
          </div>

          {tags.length < 5 && (
            <p className="text-yellow-400 mt-4 font-medium">
              ⚠️ {5 - tags.length} more tag(s) needed
            </p>
          )}
          {tags.length >= 5 && (
            <p className="text-green-400 mt-4 font-medium">
              ✓ {tags.length} tags added
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center pt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-20 py-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-2xl rounded-2xl shadow-2xl shadow-orange-900/60 hover:shadow-orange-900/80 transition duration-300 cursor-pointer"
          >
            {isUpdate ? "Save & Next → (Update)" : "Next Step →"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step1Form;
