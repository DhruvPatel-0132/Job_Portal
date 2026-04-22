export default function CompanySelectStep({
  search, setSearch,
  selectedCompany, setSelectedCompany,
  isNewCompany, setIsNewCompany,
  newCompany, setNewCompany,
  handleSubmit
}) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-2">Select Company</h2>

      {!isNewCompany && (
        <>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input" />

          <div className="mt-4 space-y-2">
            {["Google","Microsoft","Amazon","Meta"]
              .filter(c => c.toLowerCase().includes(search.toLowerCase()))
              .map((c,i)=>(
                <div key={i} onClick={()=>setSelectedCompany(c)} className={`card ${selectedCompany===c && "active"}`}>
                  🏢 {c}
                </div>
              ))}
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