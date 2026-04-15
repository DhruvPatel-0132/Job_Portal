import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [hireType, setHireType] = useState("");

  // Individual hiring
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [project, setProject] = useState("");

  // Company creation
  const [companyName, setCompanyName] = useState("");
  const [year, setYear] = useState("");
  const [about, setAbout] = useState("");

  // Company List
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const totalSteps = role === "job_seeker" ? 3 : role === "company" ? 4 : 5;

  const progress = (step / totalSteps) * 100;

  const next = () => setStep((p) => p + 1);
  const back = () => setStep((p) => p - 1);

  const handleSubmit = () => {
    console.log({
      role,
      hireType,
      skills,
      experience,
      project,
      companyName,
      year,
      about,
    });
  };

  const container = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8">
        {/* Step Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                step >= i + 1 ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-black"
            animate={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" {...container}>
              <h2 className="text-2xl text-center mb-6">Create account</h2>

              <input placeholder="Email or Phone" className="input" />
              <input
                type="password"
                placeholder="Password"
                className="input mt-3"
              />

              <button onClick={next} className="btn-primary w-full mt-6">
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" {...container}>
              <h2 className="text-2xl text-center mb-6">Your name</h2>

              <input placeholder="First Name" className="input" />
              <input placeholder="Last Name" className="input mt-3" />

              <div className="flex justify-between mt-6">
                <button onClick={back}>Back</button>
                <button onClick={next} className="btn-primary">
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" {...container}>
              <h2 className="text-2xl text-center mb-6">
                What brings you here?
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setRole("job_seeker")}
                  className={`card ${role === "job_seeker" && "active"}`}
                >
                  👨‍💻 Find a Job
                </div>

                <div
                  onClick={() => setRole("hire")}
                  className={`card ${role === "hire" && "active"}`}
                >
                  🧑‍💼 Hire Talent
                </div>

                <div
                  onClick={() => setRole("company")}
                  className={`card ${role === "company" && "active"}`}
                >
                  🏢 Create Company Page
                </div>
              </div>

              <button
                onClick={() => {
                  if (role === "job_seeker") {
                    handleSubmit(); // END here
                  } else {
                    next();
                  }
                }}
                disabled={!role}
                className="btn-primary w-full mt-6"
              >
                {role === "job_seeker" ? "Finish" : "Continue"}
              </button>
            </motion.div>
          )}

          {/* STEP 4 - HIRE TYPE */}
          {step === 4 && role === "hire" && (
            <motion.div key="s4-hire" {...container}>
              <h2 className="text-2xl text-center mb-6">
                How do you want to hire?
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setHireType("individual")}
                  className={`card ${hireType === "individual" && "active"}`}
                >
                  🧑‍💻 Individual
                </div>

                <div
                  onClick={() => setHireType("company")}
                  className={`card ${hireType === "company" && "active"}`}
                >
                  🏢 Company
                </div>
              </div>

              <button
                onClick={next}
                disabled={!hireType}
                className="btn-primary w-full mt-6"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 4 - COMPANY CREATION */}
          {step === 4 && role === "company" && (
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
          )}

          {/* STEP 5 - INDIVIDUAL HIRING */}
          {step === 5 && role === "hire" && hireType === "individual" && (
            <motion.div key="s5-ind" {...container}>
              <h2 className="text-2xl text-center mb-2">Hiring Details</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Tell us what kind of help you need
              </p>

              {/* FIELD 1: DOMAIN / WORK TYPE */}
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="What are you hiring for? (e.g. Web Development, AI, Design)"
                className="input"
              />

              {/* FIELD 2: EXPERIENCE */}
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Required Experience (e.g. 1 year, Fresher, 3+ years)"
                className="input mt-3"
              />

              {/* OPTIONAL: PROJECT */}
              <textarea
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Describe your project (optional)"
                className="input mt-3 h-24"
              />

              <button
                onClick={handleSubmit}
                className="btn-primary w-full mt-6"
              >
                Finish
              </button>
            </motion.div>
          )}

          {/* STEP 5 - COMPANY SELECT */}
          {step === 5 && role === "hire" && hireType === "company" && (
            <motion.div key="s5-comp" {...container}>
              <h2 className="text-2xl text-center mb-2">Select Company</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Search your company or add a new one
              </p>

              {/* SEARCH BOX */}
              {!isNewCompany && (
                <>
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedCompany("");
                    }}
                    placeholder="Search company..."
                    className="input"
                  />

                  {/* SEARCH RESULTS */}
                  <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                    {["Google", "Microsoft", "Amazon", "Meta"]
                      .filter((c) =>
                        c.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((company, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedCompany(company)}
                          className={`card ${
                            selectedCompany === company && "active"
                          }`}
                        >
                          🏢 {company}
                        </div>
                      ))}
                  </div>

                  {/* NOT LISTED OPTION */}
                  <div
                    onClick={() => {
                      setIsNewCompany(true);
                      setSelectedCompany("");
                    }}
                    className="mt-4 text-sm text-center text-gray-600 cursor-pointer hover:text-black"
                  >
                    ➕ My company is not listed
                  </div>
                </>
              )}

              {/* NEW COMPANY INPUT */}
              {isNewCompany && (
                <div className="mt-4">
                  <input
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Enter your company name"
                    className="input"
                  />

                  <button
                    onClick={() => setIsNewCompany(false)}
                    className="text-sm text-gray-500 mt-2 hover:text-black"
                  >
                    ← Back to search
                  </button>
                </div>
              )}

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={!selectedCompany && !newCompany}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                Finish
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOGIN */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <NavLink to="/" className="text-black font-medium hover:underline">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
