import { useParams, Link } from "react-router-dom";
import Loading from "../components/animation/Loading";
import { usePlayer } from "../hooks/players/usePlayer";

const PlayerDetail = () => {
  const { id } = useParams();
  const { data: player, isLoading, isError, error } = usePlayer(id);

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-600 py-20">{error?.message}</p>;
  if (!player) return <p className="text-center py-20">Player not found.</p>;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm mb-6 inline-block"
          >
            &larr; Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex justify-center">
              <img
                src={player.image}
                alt={player.name}
                className="h-96 object-fit"
              />
            </div>
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {player.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div>
                  <p className="text-gray-600">Gender</p>
                  <p className="font-semibold">
                    {player.gender === "M" ? "Male" : "Female"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  <p className="font-semibold">
                    {formatDate(player.date_of_birth)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerDetail;
