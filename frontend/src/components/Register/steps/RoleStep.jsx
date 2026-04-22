export default function RoleStep({ role, setRole, next, handleSubmit }) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-6">
        What brings you here?
      </h2>

      <div className="space-y-3">
        <div onClick={() => setRole("job_seeker")} className={`card ${role === "job_seeker" && "active"}`}>
          👨‍💻 Find a Job
        </div>

        <div onClick={() => setRole("hire")} className={`card ${role === "hire" && "active"}`}>
          🧑‍💼 Hire Talent
        </div>

        <div onClick={() => setRole("company")} className={`card ${role === "company" && "active"}`}>
          🏢 Create Company Page
        </div>
      </div>

      <button
        onClick={() => {
          if (role === "job_seeker") handleSubmit();
          else next();
        }}
        disabled={!role}
        className="btn-primary w-full mt-6"
      >
        {role === "job_seeker" ? "Finish" : "Continue"}
      </button>
    </div>
  );
}