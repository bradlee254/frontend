export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-soft">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-semibold text-calm">
          Mental Journal
        </h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
