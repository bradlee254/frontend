import Layout from "../components/Layout";

export default function Journal() {
  return (
    <Layout>
      <div className="space-y-6">
        <textarea
          className="w-full p-4 border rounded-xl min-h-[150px]"
          placeholder="How are you feeling today?"
        />

        <button className="bg-calm text-white px-6 py-2 rounded-lg">
          Save Entry
        </button>
      </div>
    </Layout>
  );
}
