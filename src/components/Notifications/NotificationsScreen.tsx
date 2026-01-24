"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Clock, Bell } from "lucide-react";
import { notificationApi } from "@/lib/api-client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const [emailNotification, setEmailNotification] = useState(true);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "never">(
    "daily",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // モックの通知履歴データ
  const notificationHistory = [
    {
      id: 1,
      date: "2時間前",
      product: "オーガニック化粧水",
      discount: "15%OFF",
      oldPrice: 3980,
      newPrice: 3383,
    },
    {
      id: 2,
      date: "昨日",
      product: "美容液セット",
      discount: "20%OFF",
      oldPrice: 5800,
      newPrice: 4640,
    },
    {
      id: 3,
      date: "3日前",
      product: "保湿クリーム",
      discount: "10%OFF",
      oldPrice: 2400,
      newPrice: 2160,
    },
  ];

  // 初期設定を取得
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settings = await notificationApi.getSettings();
        setEmailNotification(settings.email_notifications);
        setFrequency(settings.notification_frequency as typeof frequency);
        setError(null);
      } catch (err) {
        setError("設定の取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await notificationApi.updateSettings({
        email_notifications: emailNotification,
        notification_frequency: frequency,
      });

      alert("設定を保存しました ✓");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            通知設定
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          価格変動の通知方法を設定できます
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* メール通知 */}
        <div>
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            通知方法
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
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

        {/* 通知頻度 */}
        <div>
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            通知頻度
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {[
              { value: "daily", label: "日次", desc: "1日1回まとめて通知" },
              { value: "weekly", label: "週次", desc: "週1回まとめて通知" },
              {
                value: "never",
                label: "通知しない",
                desc: "価格変動の通知を受け取らない",
              },
            ].map((option, index) => (
              <div key={option.value}>
                {index > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-800" />
                )}
                <button
                  onClick={() => setFrequency(option.value as typeof frequency)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div className="flex-1 text-left">
                    <p className="text-slate-900 dark:text-white">
                      {option.label}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {option.desc}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      frequency === option.value
                        ? "border-orange-500"
                        : "border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {frequency === option.value && (
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 通知履歴 */}
        <div>
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            通知履歴
          </h2>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-200 dark:divide-slate-800">
            {notificationHistory.length > 0 ? (
              notificationHistory.map((item) => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Bell className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                          {item.product}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          ¥{item.oldPrice.toLocaleString()} → ¥
                          {item.newPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-orange-500 whitespace-nowrap">
                      {item.discount}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  まだ通知はありません
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-xl transition-colors font-medium ${
            isSaving
              ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {isSaving ? "保存中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
