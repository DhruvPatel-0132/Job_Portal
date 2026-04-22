export default function NameStep({
  next,
  back,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  errors
}) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-6">Your name</h2>

      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="input"
      />
      {errors?.firstName && <p className="text-red-500">{errors.firstName}</p>}

      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="input mt-3"
      />
      {errors?.lastName && <p className="text-red-500">{errors.lastName}</p>}

      <div className="flex justify-between mt-6">
        <button onClick={back}>Back</button>
        <button onClick={next} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
}