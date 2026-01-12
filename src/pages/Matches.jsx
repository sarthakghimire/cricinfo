import { Link } from "react-router-dom";
import Loading from "../components/animation/Loading";
import { useMatches } from "./../hooks/matches/useMatches";

const Matches = () => {
  const { data: response, isLoading, error, isError } = useMatches();

  const matches = response?.data || [];

  if (isLoading || !response) return <Loading />;
  if (isError) return <p className="text-red-600">Error:{error.message}</p>;
  if (matches.length == 0)
    return <p className="text-red-500">No matches found</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 px-4 border-l-4 border-indigo-500 ml-2">
          All Matches
        </h1>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => {
            if (!match.team_1 || !match.team_2) {
              return null;
            }
            return (
              <Link
                key={match._id}
                to={`/matches/${match._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md border-t-4 border-indigo-500 border-x border-b border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 block group"
              >
                {/* Match Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center flex-1">
                      <img
                        className="w-16 h-16 rounded-full object-contain bg-white border border-gray-100 shadow-sm p-1 mb-3 group-hover:scale-110 transition-transform duration-300"
                        src={match.team_1.logo}
                        alt={match.team_1.name}
                      />
                      <p className="font-bold text-gray-900 text-center text-sm leading-tight h-10 flex items-center justify-center">
                        {match.team_1.name}
                      </p>
                    </div>

                    {/* VS */}
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">VS</span>
                       <div className="w-8 h-px bg-gray-200"></div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center flex-1">
                      <img
                        className="w-16 h-16 rounded-full object-contain bg-white border border-gray-100 shadow-sm p-1 mb-3 group-hover:scale-110 transition-transform duration-300"
                        src={match.team_2.logo}
                        alt={match.team_2.name}
                      />
                      <p className="font-bold text-gray-900 text-center text-sm leading-tight h-10 flex items-center justify-center">
                        {match.team_2.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                   <div className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate max-w-[120px]">{match.venue.name}</span>
                   </div>
                   <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                     {new Date(match.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short"
                      })}
                   </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Matches;
