export default function IndividualStep({
  skills, setSkills,
  experience, setExperience,
  project, setProject,
  handleSubmit
}) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-2">Hiring Details</h2>

      <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="What are you hiring for? (e.g. Web Development, AI, Design)" className="input" />
      <input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="equired Experience (e.g. 1 year, Fresher, 3+ years)" className="input mt-3" />
      <textarea value={project} onChange={(e) => setProject(e.target.value)} placeholder="Describe your project (optional)" className="input mt-3 h-24" />

      <button onClick={handleSubmit} className="btn-primary w-full mt-6">
        Finish
      </button>
    </div>
  );
}