"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Settings, Bell, Lock, User } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    notificationTime: "09:00",
    jobCategories: ["Full Stack", "Backend", "Frontend"],
    experienceLevel: "1-3 years",
    salaryMin: 60000,
    salaryMax: 120000,
    locations: ["Remote", "San Francisco"],
  });

  return (
    <div className="min-h-screen bg-light">
      <Navbar />

      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-indigo-100">Customize your placement journey</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-semibold">Enable Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, notificationsEnabled: e.target.checked })
                  }
                  className="w-5 h-5"
                />
              </div>

              {settings.notificationsEnabled && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notify Me At
                  </label>
                  <input
                    type="time"
                    value={settings.notificationTime}
                    onChange={(e) =>
                      setSettings({ ...settings, notificationTime: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Job Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Job Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Job Categories
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Full Stack", "Backend", "Frontend", "Data Science", "DevOps"].map(
                    (cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={settings.jobCategories.includes(cat)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Fresher</option>
                  <option selected>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Salary Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Min Salary</label>
                    <input
                      type="number"
                      value={settings.salaryMin}
                      onChange={(e) =>
                        setSettings({ ...settings, salaryMin: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max Salary</label>
                    <input
                      type="number"
                      value={settings.salaryMax}
                      onChange={(e) =>
                        setSettings({ ...settings, salaryMax: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Preferred Locations
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Remote", "San Francisco", "New York", "Bangalore", "Hyderabad"].map(
                    (loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={settings.locations.includes(loc)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{loc}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Settings */}
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Save Changes
            </button>
            <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
