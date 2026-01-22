"use client";

import { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Heart,
  RefreshCw,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [pushNotification, setPushNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <div className="pb-4">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
          <h1 className="text-2xl text-slate-900 dark:text-white">設定</h1>
        </div>

        {/* Content */}
        <div className="px-6 pt-6 space-y-6">
          {/* Account Section */}
          <div>
            <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              アカウント
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setIsProfileDialogOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left text-slate-900 dark:text-white">
                  プロフィール
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <button
                onClick={() => {
                  // TODO: バックエンドAPIと連携
                  console.log("ログアウト実行");
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="flex-1 text-left text-slate-900 dark:text-white">
                  ログアウト
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <span className="flex-1 text-left text-red-600 dark:text-red-400">
                  アカウント削除
                </span>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          {/* Notification Section */}
          <div>
            <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              通知方法
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-900 dark:text-white">
                      プッシュ通知
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      ブラウザ通知で即座にお知らせ
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPushNotification(!pushNotification)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    pushNotification
                      ? "bg-orange-500"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      pushNotification ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-slate-900 dark:text-white">メール通知</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      example@email.com
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailNotification(!emailNotification)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    emailNotification
                      ? "bg-orange-500"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      emailNotification ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Watchlist Section */}
          <div>
            <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              ウォッチリスト
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <p className="text-slate-900 dark:text-white">登録上限</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 pl-8">
                  最大50件まで商品を登録できます。上限に達した場合は、不要な商品を削除してから新しい商品を追加してください。
                </p>
              </div>
            </div>
          </div>

          {/* Data Update Section */}
          <div>
            <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              データ更新
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <p className="text-slate-900 dark:text-white">自動更新</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 pl-8 mb-3">
                  価格情報は毎日朝6時に自動的に更新されます。更新後、値下がりした商品があれば通知でお知らせします。
                </p>
                <div className="pl-8">
                  <button className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-xl text-sm hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>今すぐ更新</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              その他
            </h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="flex-1 text-left text-slate-900 dark:text-white">
                  利用規約
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="flex-1 text-left text-slate-900 dark:text-white">
                  プライバシーポリシー
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="flex-1 text-left text-slate-900 dark:text-white">
                  お問い合わせ
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <div className="border-t border-slate-200 dark:border-slate-800" />
              <div className="px-4 py-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  Version 1.0.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileEditDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />
      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
