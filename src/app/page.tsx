export default function HomePage() {
  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Memloop 🧠</h1>
      <p className="mb-6 text-gray-600">
        Capture, reflect, and remember event highlights together.
      </p>
      <a
        href="/submit"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
      >
        Submit a Memory
      </a>
    </main>
  );
}
