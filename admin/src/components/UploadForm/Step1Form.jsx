import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";

const Step1Form = ({ onNext, formData = {}, setFormData }) => {
  const [tags, setTags] = useState(formData.tags || []);
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      apkTitle: formData.apkTitle || "",
      appCategory: formData.appCategory || "",
      shortDescription: formData.shortDescription || "",
      apkLogo: formData.apkLogo || null,
      requiresGoogleRestrictions: formData.requiresGoogleRestrictions || false,
      uploadVideo: formData.uploadVideo || null,
      appPlatform: formData.appPlatform || "",
      apkFile: formData.apkFile || null,
      screenshots: formData.screenshots || [],
      apkVersion: formData.apkVersion || "",
      tagInput: "",
    },
  });

  const requiresGoogleRestrictions = watch("requiresGoogleRestrictions");
  const apkLogo = watch("apkLogo");
  const uploadVideo = watch("uploadVideo");
  const screenshots = watch("screenshots") || [];

  const addTag = () => {
    const tagInput = getValues("tagInput");
    const trimmed = tagInput?.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setValue("tagInput", "");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Remove functions
  const removeLogo = () => setValue("apkLogo", null);
  const removeVideo = () => setValue("uploadVideo", null);
  const removeScreenshot = (index) => {
    const updated = screenshots.filter((_, i) => i !== index);
    setValue("screenshots", updated);
  };

  const onSubmitStep1 = async (data) => {
    if (tags.length < 5) {
      alert("Minimum 5 tags required!");
      return;
    }
    if (screenshots.length < 4 || screenshots.length > 12) {
      alert("You must upload between 4 and 12 screenshots!");
      return;
    }

    const validated = await trigger();
    if (!validated) return;

    const step1Data = { ...data, tags };
    if (setFormData) {
      setFormData((prev) => ({ ...prev, ...step1Data }));
    }
    onNext(step1Data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 mb-10"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Step 1 – App Details
      </h2>

      <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-8">
        {/* APK Title */}
        <div>
          <label className="block text-xl font-semibold mb-3">APK Title</label>
          <Controller
            name="apkTitle"
            control={control}
            rules={{ required: "APK Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                placeholder="e.g. My Awesome App"
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition"
              />
            )}
          />
          {errors.apkTitle && (
            <p className="text-red-400 mt-2">{errors.apkTitle.message}</p>
          )}
        </div>

        {/* App Category */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            App Category
          </label>
          <Controller
            name="appCategory"
            control={control}
            rules={{ required: "Please select a category" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option className="text-black" value="">
                  Select a category
                </option>
                {[
                  "Games",
                  "Tools",
                  "Social Media",
                  "Productivity",
                  "Entertainment",
                  "Education",
                  "Health & Fitness",
                  "Photography",
                  "Music",
                ].map((cat) => (
                  <option className="text-black" key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.appCategory && (
            <p className="text-red-400 mt-2">{errors.appCategory.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            Short Description
          </label>
          <Controller
            name="shortDescription"
            control={control}
            rules={{ required: "Short description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder="Briefly describe your app..."
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition"
              />
            )}
          />
          {errors.shortDescription && (
            <p className="text-red-400 mt-2">
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* APK Logo Upload + Preview */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            APK Logo (Image Only)
          </label>
          <Controller
            name="apkLogo"
            control={control}
            rules={{ required: "App logo is required" }}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-bold cursor-pointer"
              />
            )}
          />
          {errors.apkLogo && (
            <p className="text-red-400 mt-2">{errors.apkLogo.message}</p>
          )}

          {/* Logo Preview */}
          {apkLogo && (
            <div className="mt-4 relative inline-block">
              <img
                src={URL.createObjectURL(apkLogo)}
                alt="App Logo Preview"
                className="w-32 h-32 object-cover rounded-2xl border-4 border-purple-500/50 shadow-xl"
              />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg cursor-pointer transition"
              >
                <AiOutlineClose className="text-white text-lg" />
              </button>
            </div>
          )}
        </div>

        {/* Google Restrictions */}
        <div className="flex items-center gap-5">
          <label className="text-xl font-semibold">
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
                className="w-7 h-7 accent-purple-500 rounded cursor-pointer"
              />
            )}
          />
        </div>

        {/* Video Upload + Preview */}
        {requiresGoogleRestrictions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-xl font-semibold mb-3">
              Upload Video (Max 25MB)
            </label>
            <Controller
              name="uploadVideo"
              control={control}
              rules={{ required: "Video is required" }}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 25 * 1024 * 1024) {
                      alert("Video must be 25MB or smaller");
                      return;
                    }
                    onChange(file || null);
                  }}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-bold cursor-pointer"
                />
              )}
            />
            {errors.uploadVideo && (
              <p className="text-red-400 mt-2">{errors.uploadVideo.message}</p>
            )}

            {/* Video Preview */}
            {uploadVideo && (
              <div className="mt-4 relative inline-block">
                <video
                  controls
                  className="w-80 rounded-2xl border-4 border-purple-500/50 shadow-xl"
                >
                  <source src={URL.createObjectURL(uploadVideo)} />
                  Your browser does not support video playback.
                </video>
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 rounded-full p-2 shadow-lg cursor-pointer transition"
                >
                  <AiOutlineClose className="text-white text-lg" />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Platform */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            Your App Platform
          </label>
          <Controller
            name="appPlatform"
            control={control}
            rules={{ required: "Please select a platform" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option className="text-black" value="">Choose platform</option>
                <option className="text-black" value="Android">Android</option>
                <option className="text-black" value="iOS">iOS</option>
                <option className="text-black" value="Both">Both</option>
              </select>
            )}
          />
          {errors.appPlatform && (
            <p className="text-red-400 mt-2">{errors.appPlatform.message}</p>
          )}
        </div>

        {/* APK File Upload */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            Upload APK File
          </label>
          <Controller
            name="apkFile"
            control={control}
            rules={{ required: "APK file is required" }}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                accept=".apk"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-bold cursor-pointer"
              />
            )}
          />
          {errors.apkFile && (
            <p className="text-red-400 mt-2">{errors.apkFile.message}</p>
          )}
          {watch("apkFile") && (
            <p className="text-green-400 mt-2">✓ {watch("apkFile").name}</p>
          )}
        </div>

        {/* Screenshots Upload + Numbered Preview */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            Upload Screenshots (Min 4, Max 12)
          </label>
          <Controller
            name="screenshots"
            control={control}
            rules={{ required: "Screenshots are required" }}
            render={({ field: { onChange } }) => (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                    ? Array.from(e.target.files)
                    : [];
                  onChange(files);
                }}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl file:mr-6 file:py-3 file:px-8 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white file:font-bold cursor-pointer"
              />
            )}
          />
          {errors.screenshots && (
            <p className="text-red-400 mt-2">{errors.screenshots.message}</p>
          )}

          {/* Screenshots Preview with Numbers */}
          {screenshots.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {screenshots.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-48 object-cover rounded-2xl border-4 border-purple-500/30 shadow-lg"
                  />
                  <div className="absolute bottom-2 left-2 bg-purple-600/80 text-white px-3 py-1 rounded-lg font-bold">
                    {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <AiOutlineClose className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* APK Version */}
        <div>
          <label className="block text-xl font-semibold mb-3">
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
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition"
              />
            )}
          />
          {errors.apkVersion && (
            <p className="text-red-400 mt-2">{errors.apkVersion.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xl font-semibold mb-3">
            Tags (Minimum 5)
          </label>
          <div className="flex gap-4 mb-4">
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
                  placeholder="Type tag and press Enter/Add"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:border-purple-500 transition"
                />
              )}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold shadow-lg hover:shadow-purple-600/50 transition cursor-pointer"
            >
              <AiOutlinePlus className="text-2xl" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-3 px-5 py-3 bg-purple-600/30 rounded-2xl border border-purple-500/30"
              >
                <span className="font-medium">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-red-400 hover:text-red-300 transition cursor-pointer"
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </div>
            ))}
          </div>

          {tags.length < 5 && (
            <p className="text-yellow-400 mt-3 font-medium">
              ⚠️ {5 - tags.length} more tag(s) needed
            </p>
          )}
          {tags.length >= 5 && (
            <p className="text-green-400 mt-3 font-medium">
              ✓ {tags.length} tags added
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="text-center pt-10">
          <button
            type="submit"
            className="px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-600/60 transition transform hover:scale-105 cursor-pointer"
          >
            Next Step →
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step1Form;
