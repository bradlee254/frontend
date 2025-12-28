import { useState, useEffect } from 'react';  // ← Fixed here
import { createEntry, getMyEntries } from "../services/journal.service";

interface JournalEntry {
  id: string;
  mood: number;
  activities: string[];
  content: string;
  date: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mood, setMood] = useState<number>(3);
  const [activities, setActivities] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const data = await getMyEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter your journal content.");
      return;
    }

    try {
      await createEntry({
        mood,
        activities: activities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
        content: content.trim(),
      });
      setContent("");
      setActivities("");
      setMood(3);
      await fetchEntries();  // ← await here to ensure list updates after save
    } catch (err: any) {
      console.error("Failed to save entry:", err);
      alert(err.response?.data?.message || "Failed to save entry");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSave} className="mb-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">New Journal Entry</h2>

        <label className="block mb-2">Mood:</label>
        <select
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value={1}>😢 Very Bad</option>
          <option value={2}>😟 Bad</option>
          <option value={3}>😐 Neutral</option>
          <option value={4}>🙂 Good</option>
          <option value={5}>😄 Very Good</option>
        </select>

        <label className="block mb-2">Activities (comma-separated):</label>
        <input
          type="text"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="e.g. Reading, Exercise, Meditation"
        />

        <label className="block mb-2">Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Write your thoughts here..."
          rows={5}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:opacity-90"
        >
          Save Entry
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Entries</h2>
        {entries.length === 0 && <p>No entries yet.</p>}
        {entries.map((entry) => (
          <div key={entry.id} className="mb-4 p-4 border rounded bg-gray-50">
            <div className="text-sm text-gray-500 mb-1">
              {new Date(entry.date).toLocaleString()}
            </div>
            <div className="mb-1">
              Mood:{' '}
              {entry.mood === 1 ? '😢' :
               entry.mood === 2 ? '😟' :
               entry.mood === 3 ? '😐' :
               entry.mood === 4 ? '🙂' : '😄'} {' '}
              ({entry.mood})
            </div>
            <div className="mb-1">
              Activities: {entry.activities.join(", ") || "None"}
            </div>
            <div>{entry.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}