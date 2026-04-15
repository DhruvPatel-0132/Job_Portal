import { motion } from "framer-motion";

export default function CompanyFormStep({
  companyName, setCompanyName,
  year, setYear,
  about, setAbout,
  handleSubmit
}) {
  const container = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.3 },
  };

  return (
    <motion.div key="s4-company" {...container}>
      <h2 className="text-2xl text-center mb-6">Company Details</h2>

      <input
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company Name"
        className="input"
      />

      <input
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Established Year"
        className="input mt-3"
      />

      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder="About Company"
        className="input mt-3 h-24"
      />

      <button
        onClick={handleSubmit}
        className="btn-primary w-full mt-6"
      >
        Finish
      </button>
    </motion.div>
  );
}