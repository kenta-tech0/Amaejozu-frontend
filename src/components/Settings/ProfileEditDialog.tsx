"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const [name, setName] = useState("山田太郎");
  const [bio, setBio] = useState("コスメ好きです！");
  const [email, setEmail] = useState("example@email.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleSave = () => {
    // パスワード一致チェック
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setShowPasswordError(true);
      return; // 保存しない
    }

    // TODO: バックエンドAPIと連携
    console.log("保存:", {
      name,
      bio,
      email,
      currentPassword,
      newPassword,
      // confirmPassword は送らない
    });

    setShowPasswordError(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>プロフィール編集</DialogTitle>
          <DialogDescription>プロフィール情報を編集できます</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto max-h-[60vh] px-1">
          {/* 名前入力 */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              名前
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="名前を入力"
            />
          </div>

          {/* 自己紹介 */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              自己紹介
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="自己紹介を入力"
            />
          </div>

          {/* メールアドレス */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-900 dark:text-white"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="メールアドレスを入力"
            />
          </div>

          {/* パスワード変更セクション */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
              パスワード変更（任意）
            </h3>

            {/* 現在のパスワード */}
            <div className="space-y-2 mb-3">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-slate-900 dark:text-white"
              >
                現在のパスワード
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="現在のパスワード"
              />
            </div>

            {/* 新しいパスワード */}
            <div className="space-y-2 mb-3">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-slate-900 dark:text-white"
              >
                新しいパスワード
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="新しいパスワード"
              />
            </div>

            {/* パスワード確認 */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-900 dark:text-white"
              >
                パスワード確認
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="パスワードを再入力"
              />
              {/* エラーメッセージ */}
              {showPasswordError && (
                <p className="text-sm text-red-500">パスワードが一致しません</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            保存
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
