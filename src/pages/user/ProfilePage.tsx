import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function ProfilePage() {
  const { user, fetchMe, updateAvatar } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await fetchMe();
      } catch {
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [fetchMe]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    setIsSaving(true);
    try {
      await apiClient.put(`/user/${user.id}`, {
        id: user.id,
        name: formData.name,
        bio: formData.bio,
      });

      await fetchMe();
      toast.success("Cập nhật thông tin thành công!");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Cập nhật thông tin thất bại";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Đây không phải là file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await updateAvatar(file);
      toast.success("Đổi ảnh đại diện thành công!");
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Không thể tải ảnh lên";
      toast.error(errorMessage);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-8 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý thông tin cá nhân của bạn
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="max-w-2xl space-y-6">
          {/* Avatar Section */}
          <div className="flex items-start gap-6 pb-6 border-b">
            <div className="flex-shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {formData.name.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</h3>
              <p className="text-sm text-gray-500 mb-3">
                Ảnh của bạn giúp người khác nhận ra bạn
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? "Đang tải lên..." : "Thay đổi ảnh"}
              </Button>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-3 block">
              Tên người dùng: <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              className="max-w-md"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-3 block">
              Email:
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Email của bạn"
              className="max-w-md bg-gray-50 cursor-not-allowed"
              disabled
              readOnly
            />
            <p className="text-xs text-gray-500">
              Email không thể thay đổi
            </p>
          </div>

          {/* Bio Field */}
          <div className="space-y-2 mt-8">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700 mb-3 block">
              Lý lịch <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Viết một vài câu về bản thân bạn..."
              className="max-w-2xl min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {formData.bio.length}/500 ký tự
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
