import { motion } from "framer-motion";

export default function IndividualStep({
  skills, setSkills,
  experience, setExperience,
  project, setProject,
  handleSubmit
}) {
  const container = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.3 },
  };

  return (
    <motion.div key="s4-individual" {...container}>
      <h2 className="text-2xl text-center mb-6 font-semibold">Professional Details</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 ml-1">Current Profession / Skills</label>
          <input 
            value={skills} 
            onChange={(e) => setSkills(e.target.value)} 
            placeholder="e.g. Web Development, AI, Design" 
            className="input mt-1" 
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 ml-1">Years of Experience</label>
          <input 
            value={experience} 
            onChange={(e) => setExperience(e.target.value)} 
            placeholder="e.g. 1 year, Fresher, 3+ years" 
            className="input mt-1" 
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 ml-1">Current Work / Projects (Optional)</label>
          <textarea 
            value={project} 
            onChange={(e) => setProject(e.target.value)} 
            placeholder="Describe what you are currently working on..." 
            className="input mt-1 h-24" 
          />
        </div>
      </div>

      <button onClick={handleSubmit} className="btn-primary w-full mt-8">
        Finish
      </button>
    </motion.div>
  );
}