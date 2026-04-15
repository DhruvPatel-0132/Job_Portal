export default function HireTypeStep({ hireType, setHireType, next }) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-6">
        How do you want to hire?
      </h2>

      <div className="space-y-3">
        <div onClick={() => setHireType("individual")} className={`card ${hireType === "individual" && "active"}`}>
          🧑‍💻 Individual
        </div>

        <div onClick={() => setHireType("company")} className={`card ${hireType === "company" && "active"}`}>
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
    </div>
  );
}