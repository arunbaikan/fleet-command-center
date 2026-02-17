import { useEffect, useState } from "react";

const messages = [
  "Please wait… comparing banks with a calculator 🤓",
  "Talking nicely to lenders… please hold ☎️",
  "Crunching numbers like a finance wizard 🧙‍♂️",
  "Making APR behave… almost there 📊",
  "Convincing banks to give you better rates 😄",
  "Sharpening pencils for EMI math ✏️",
];

export default function FunnyLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className=" z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      
      {/* Spinner */}
      <div className="h-14 w-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-6" />

      {/* Message */}
      <p className="text-lg font-medium text-gray-700 text-center px-6">
        {messages[index]}
      </p>
    </div>
  );
}
