import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Smile, PlusCircle, Tag, Sparkles, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { createEntry, getMyEntries } from "../services/journal.service";

interface JournalEntry {
  id: string;
  mood: number;
  activities: string[];
  content: string;
  date: string;
}

const MOOD_MAP: Record<number, { icon: string; label: string; color: string; bg: string }> = {
  1: { icon: '😢', label: 'Very Bad', color: 'text-red-600', bg: 'bg-red-50 border-red-300' },
  2: { icon: '😟', label: 'Bad', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300' },
  3: { icon: '😐', label: 'Neutral', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-300' },
  4: { icon: '🙂', label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' },
  5: { icon: '😄', label: 'Very Good', color: 'text-green-600', bg: 'bg-green-50 border-green-300' },
};

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showEntries, setShowEntries] = useState(false);
  const [formData, setFormData] = useState({
    mood: 3,
    activities: "",
    content: ""
  });
  const [activityPills, setActivityPills] = useState<string[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const data = await getMyEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      showNotification("Failed to load entries", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    if (!formData.content.trim()) {
      showNotification("Please write something before saving", "error");
      return;
    }

    setLoading(true);
    try {
      const activitiesArray = formData.activities.split(",").map(a => a.trim()).filter(Boolean);
      await createEntry({
        ...formData,
        activities: activitiesArray,
      });

      setFormData({ mood: 3, activities: "", content: "" });
      setActivityPills([]);
      await fetchEntries();
      showNotification("Entry saved successfully! 🎉");
    } catch (err: any) {
      showNotification(err.response?.data?.message || "Error saving entry", "error");
    } finally {
      setLoading(false);
    }
  };

  const getMoodStats = () => {
    if (entries.length === 0) return null;
    const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
    return avgMood.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-purple-600">
              Mindful Journal
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Capture your thoughts, track your mood, cherish your moments</p>
          
          {entries.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>{entries.length} entries · Average mood: {getMoodStats()}/5.0</span>
            </div>
          )}
        </header>

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-slide-fade z-50 ${
            notification.includes("Error") || notification.includes("Failed") 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {notification}
          </div>
        )}

        {/* Input Section */}
        <section className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-800">New Entry</h2>
          </div>

          <div className="space-y-6">
            
            {/* Mood Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Smile className="w-4 h-4" />
                How are you feeling today?
              </label>
              <div className="grid grid-cols-5 gap-3">
                {Object.entries(MOOD_MAP).map(([val, info]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, mood: Number(val) })}
                    className={`relative py-4 rounded-2xl text-3xl transition-all transform hover:scale-105 ${
                      formData.mood === Number(val)
                        ? `${info.bg} border-2 scale-105 shadow-lg`
                        : 'bg-gray-50 border-2 border-gray-200 grayscale hover:grayscale-0'
                    }`}
                    title={info.label}
                  >
                    {info.icon}
                    {formData.mood === Number(val) && (
                      <span className={`block text-xs font-medium mt-1 ${info.color}`}>
                        {info.label}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Tag className="w-4 h-4" />
                What did you do today?
              </label>
              <input
                type="text"
                value={formData.activities}
                onChange={(e) => {
                  setFormData({ ...formData, activities: e.target.value });
                  setActivityPills(e.target.value.split(",").map(a => a.trim()).filter(Boolean));
                }}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g., Coding, Coffee with friends, Morning run..."
              />
              <p className="text-xs text-gray-500 mt-2">Separate activities with commas</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {activityPills.map((act, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <BookOpen className="w-4 h-4" />
                What's on your mind?
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[140px] resize-none transition-all"
                placeholder="Express yourself freely... Share your thoughts, feelings, and experiences."
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                {formData.content.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              <PlusCircle className="w-5 h-5" />
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </section>

        {/* Journey Toggle */}
        <button
          type="button"
          onClick={() => setShowEntries(!showEntries)}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all flex items-center justify-between shadow-lg hover:shadow-xl border-2 border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-purple-600" />
            <span className="text-xl">Your Journey</span>
            {entries.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                {entries.length}
              </span>
            )}
          </div>
          {showEntries ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
        </button>

        {/* Feed Section */}
        {showEntries && (
          <section className="space-y-5 animate-fade-in">
            {entries.length === 0 ? (
              <div className="bg-white text-center py-16 px-6 rounded-3xl border-2 border-dashed border-gray-300">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No entries yet</p>
                <p className="text-gray-400 text-sm">Start journaling to track your thoughts and mood!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {entries.map((entry) => {
                  const moodInfo = MOOD_MAP[entry.mood];
                  return (
                    <article
                      key={entry.id}
                      className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all transform hover:scale-[1.01]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <time className="text-sm text-gray-500 font-medium">
                            {new Date(entry.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl">{moodInfo?.icon}</span>
                          <span className={`text-xs font-medium mt-1 ${moodInfo?.color}`}>
                            {moodInfo?.label}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 leading-relaxed mb-4 text-base whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      
                      {entry.activities.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                          {entry.activities.map((act, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slide-fade {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-fade { animation: slide-fade 0.35s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
