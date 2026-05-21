import { useState, useEffect } from "react";
import axios from "axios";

export default function CompanySelectStep({
  search, setSearch,
  selectedCompany, setSelectedCompany,
  isNewCompany, setIsNewCompany,
  newCompany, setNewCompany,
  handleSubmit
}) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/companies");
        if (res.data.success) {
          setCompanies(res.data.companies.map((c) => c.name));
        }
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-center mb-2">Select Company</h2>

      {!isNewCompany && (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input" />

          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {companies
              .filter(c => c.toLowerCase().includes(search.toLowerCase()))
              .map((c,i)=>(
                <div key={i} onClick={()=>setSelectedCompany(c)} className={`card ${selectedCompany===c && "active"}`}>
                  🏢 {c}
                </div>
              ))}
            {companies.filter(c => c.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No companies found</p>
            )}
          </div>

          <div onClick={()=>setIsNewCompany(true)} className="mt-4 text-sm text-center cursor-pointer">
            ➕ My company is not listed
          </div>
        </>
      )}

      {isNewCompany && (
        <>
          <input value={newCompany} onChange={(e)=>setNewCompany(e.target.value)} className="input"/>
          <button onClick={()=>setIsNewCompany(false)}>Back</button>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedCompany && !newCompany}
        className="btn-primary w-full mt-6"
      >
        Finish
      </button>
    </div>
  );
}