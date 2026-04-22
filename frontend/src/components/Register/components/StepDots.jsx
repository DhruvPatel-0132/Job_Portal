export default function StepDots({ step, totalSteps }) {
  return (
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
  );
}