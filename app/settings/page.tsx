"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const SettingsPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentSub, setShowCurrentSub] = useState(false);
  const [showNewSub, setShowNewSub] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.success) {
          setUsername(data.user.name || "");
          setEmail(data.user.email || "");
          setAvatarPreview(data.user.image || null);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setProfileMessage("Max size 2MB");
      setProfileSuccess(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setProfileMessage("Username khali nahi ho sakta");
      setProfileSuccess(false);
      return;
    }

    setSavingProfile(true);
    setProfileMessage("");

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          image: avatarPreview,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProfileMessage("Profile updated successfully!");
        setProfileSuccess(true);

        localStorage.setItem("userName", data.user.name);
        if (data.user.image) {
          localStorage.setItem("userImage", data.user.image);
        } else {
          localStorage.removeItem("userImage");
        }
        window.dispatchEvent(new Event("auth-change"));
      } else {
        setProfileMessage(data.message || "Update failed");
        setProfileSuccess(false);
      }
    } catch (err) {
      setProfileMessage("Something went wrong. Please try again!");
      setProfileSuccess(false);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("All fields are required");
      setPasswordSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match!");
      setPasswordSuccess(false);
      return;
    }

    setSavingPassword(true);
    setPasswordMessage("");

    try {
      const res = await fetch("/api/user/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordMessage("Password changed successfully!");
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMessage(data.message || "Password change failed");
        setPasswordSuccess(false);
      }
    } catch (err) {
      setPasswordMessage("Something went wrong. Please try again!");
      setPasswordSuccess(false);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.clear();
      window.dispatchEvent(new Event("auth-change"));
      window.location.href = "/";
    }
  };

  const handleDeleteAccount = async () => {
    const confirmBox = confirm(
      "Are you absolutely sure you want to delete your AeroCode account permanently?"
    );
    if (!confirmBox) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        localStorage.clear();
        window.dispatchEvent(new Event("auth-change"));
        window.location.href = "/";
      } else {
        alert(data.message || "Delete failed");
        setDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again!");
      setDeleting(false);
    }
  };

  const firstLetter = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-300 font-sans antialiased selection:bg-lime-500/30 selection:text-lime-400 pb-20">
      {/* Navbar Header */}
      <header className="h-16 border-b border-lime-500/20 px-4 md:px-8 flex items-center gap-4 bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-20 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <Link
          href="/"
          className="p-2 rounded-xl text-zinc-400 hover:text-lime-400 hover:bg-lime-500/10 border border-transparent hover:border-lime-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-md font-extrabold text-lime-400 tracking-tight drop-shadow-[0_0_12px_rgba(163,230,53,0.3)]">
            Account Settings
          </h1>
          <p className="text-[11px] text-zinc-500 font-medium">
            Manage your AeroCode profile & security
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-[#0a0f1d]/90 border border-lime-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(163,230,53,0.05)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 border-b border-lime-500/20 pb-4">
            <div className="p-2 rounded-xl bg-lime-500/10 border border-lime-500/20">
              <User size={18} className="text-lime-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Your Profile
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center gap-5">
              <div
                onClick={triggerFileInput}
                className="relative group cursor-pointer w-20 h-20 rounded-2xl overflow-hidden border-2 border-lime-500/30 hover:border-lime-400 transition-all duration-300 shrink-0 shadow-[0_0_20px_rgba(163,230,53,0.15)]"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-lime-500/20 to-lime-400/5 flex items-center justify-center text-lime-400 text-2xl font-black select-none">
                    {firstLetter}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera size={20} className="text-lime-400" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col items-start gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">
                    Profile Picture
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    JPG, PNG or GIF (Max 2MB)
                  </p>
                </div>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-xs font-semibold text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 bg-zinc-900/50 hover:bg-red-500/10 px-3 py-1 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    Remove Avatar
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#030712] border border-white/10 focus:border-lime-400/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider select-none">
                  Email Address (Locked)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  title="Email settings can't be changed"
                  className="bg-[#030712]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed select-none font-medium opacity-60"
                />
              </div>
            </div>

            {profileMessage && (
              <div
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${
                  profileSuccess
                    ? "bg-lime-500/10 text-lime-400 border-lime-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}
              >
                {profileSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{profileMessage}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                {savingProfile && <Loader2 size={14} className="animate-spin" />}
                <span>{savingProfile ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>
        </section>

        <section className="bg-[#0a0f1d]/90 border border-lime-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
          <div className="flex items-center gap-3 mb-6 border-b border-lime-500/20 pb-4">
            <div className="p-2 rounded-xl bg-lime-500/10 border border-lime-500/20">
              <Lock size={18} className="text-lime-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Update Password
            </h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative w-full">
                <input
                  type={showCurrentSub ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#030712] border border-white/10 focus:border-lime-400/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentSub(!showCurrentSub)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 transition-colors cursor-pointer"
                >
                  {showCurrentSub ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showNewSub ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-[#030712] border border-white/10 focus:border-lime-400/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewSub(!showNewSub)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 transition-colors cursor-pointer"
                  >
                    {showNewSub ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="bg-[#030712] border border-white/10 focus:border-lime-400/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${
                  passwordSuccess
                    ? "bg-lime-500/10 text-lime-400 border-lime-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}
              >
                {passwordSuccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{passwordMessage}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                {savingPassword && <Loader2 size={14} className="animate-spin" />}
                <span>{savingPassword ? "Updating..." : "Change Password"}</span>
              </button>
            </div>
          </form>
        </section>

        <section className="bg-[#0a0f1d]/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
          <div className="flex items-center gap-3 mb-4 border-b border-red-500/20 pb-3">
            <span className="text-red-400 font-extrabold text-xs uppercase tracking-widest">
              Danger Zone
            </span>
          </div>

          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Actions here affect your account session and stored audit logs. Please proceed with caution.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-zinc-800/40 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Logout Session</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>{deleting ? "Deleting..." : "Delete Account"}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SettingsPage;