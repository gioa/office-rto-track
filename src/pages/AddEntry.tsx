
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import EntryForm from "@/components/EntryForm/EntryForm";

const AddEntry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-16 md:pl-56 pr-0">
          <div className="container py-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight animate-slide-down">Add Entry</h2>
              <p className="text-muted-foreground animate-slide-down animation-delay-100">
                Record office visits, sick days, PTO, or company events
              </p>
            </div>
            
            <EntryForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEntry;
