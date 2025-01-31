import DataTable from "../components/DataTable";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <DataTable />
      </main>
      <Footer />
    </div>
  );
}
