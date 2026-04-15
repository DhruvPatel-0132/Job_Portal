export default function AuthStep({
  next,
  emailOrPhone,
  setEmailOrPhone,
  password,
  setPassword,
  errors
}) {
  return (
    <div>
      <h2 className="text-2xl text-center mb-6">Create account</h2>

      <input
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        placeholder="Email or Phone"
        className="input"
      />
      {errors?.emailOrPhone && <p className="text-red-500">{errors.emailOrPhone}</p>}

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input mt-3"
      />
      {errors?.password && <p className="text-red-500">{errors.password}</p>}

      <button onClick={next} className="btn-primary w-full mt-6">
        Continue
      </button>
    </div>
  );
}