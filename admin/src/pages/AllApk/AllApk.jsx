import { useEffect, useState } from "react";

const AllApk = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2"
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c) => ({
          name: c?.name?.common,
          flag: c?.flags?.png,
          code:
            c?.idd?.root && c?.idd?.suffixes
              ? c?.idd?.root + c?.idd?.suffixes[0]
              : "N/A",
          short: c?.cca2,
        }));

        setCountries(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <h1 className="text-2xl font-semibold text-center py-10">
        Loading Countries...
      </h1>
    );

  return (
    <div className="min-h-screen p-5">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌍 All Countries List
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {countries.map((c, i) => (
          <div
            key={i}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <img src={c.flag} alt={c.name} className="w-10 h-7 object-cover border" />
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <p className="text-sm text-gray-600">{c.short}</p>
              </div>
            </div>

            <p className="mt-2 font-bold">
              📞 Code: <span className="text-blue-600">{c.code}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApk;
