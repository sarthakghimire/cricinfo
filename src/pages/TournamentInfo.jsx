import Loading from "../components/animation/Loading";
import { useParams, Link } from "react-router-dom";
import { useTournament } from "./../hooks/tournaments/useTournament";

const TournamentInfo = () => {
  const { id } = useParams();

  const { data: response, isLoading, isError, error } = useTournament(id);

  const tournament = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-2xl font-bold mb-4">
            Tournament not found
          </p>
          <Link
            to="/"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-sm border-t-4 border-indigo-500 border-x border-b border-gray-200 p-8 relative overflow-hidden group">
            {/* Background Banner with Gradient Fade */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
               <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20 z-10" />
               <img 
                 src={tournament.banner_image} 
                 className="w-full h-full object-cover opacity-20 grayscale-[20%] group-hover:scale-105 transition-transform duration-700" 
                 alt=""
               />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="shrink-0">
                <img
                  src={tournament.logo}
                  alt={`${tournament.name} Logo`}
                  className="w-32 h-32 object-contain bg-white rounded-full border border-gray-100 shadow-lg p-2"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                  {tournament.name}
                </h1>
                <p className="text-lg text-indigo-700 font-bold mt-2 uppercase tracking-wide">
                  Season {tournament.season}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
                     {tournament.match_type.name}
                  </span>
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
                     {tournament.tournament_type.name}
                  </span>
                  <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
                     {tournament.gender === "M" ? "Men's" : "Women's"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-8">
              
              {/* About Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">
                  {tournament.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Tournament Format</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                  <div className="bg-white p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Matches</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">32</p>
                  </div>
                  <div className="bg-white p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Teams</p>
                    <p className="text-xl font-bold text-blue-700 mt-1">8</p>
                  </div>
                  <div className="bg-white p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Overs</p>
                    <p className="text-xl font-bold text-emerald-700 mt-1">{tournament.total_overs}</p>
                  </div>
                   <div className="bg-white p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Powerplay</p>
                    <p className="text-xl font-bold text-purple-700 mt-1">{tournament.match_type.power_play_overs}</p>
                  </div>
                </div>
              </div>
              
              {/* Officials */}
               {tournament.officials.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Officials</h2>
                  <div className="flex flex-wrap gap-3">
                    {tournament.officials.map((official) => (
                      <Link
                        key={official._id}
                        to={`/officials/${official._id}`}
                        className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-4 py-1 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition group"
                      >
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                          {official.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm text-gray-800 group-hover:text-gray-900">{official.name}</span>
                           <span className="text-[10px] text-gray-500 uppercase tracking-wide">{official.type.replace(/_/g, " ")}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Info / Dates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Timeline</h3>
                 <div className="space-y-4">
                    <div className="flex items-start gap-4">
                       <div className="w-10 flex flex-col items-center">
                          <span className="text-xs font-bold text-gray-400 uppercase">Start</span>
                          <div className="h-full w-px bg-gray-200 my-1"></div>
                       </div>
                       <div>
                          <p className="font-bold text-gray-900">{new Date(tournament.created_at).toLocaleDateString("en-GB")}</p>
                          <p className="text-xs text-gray-500">Kick-off</p>
                       </div>
                    </div>
                 </div>
              </div>

               {/* Venues */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Venues</h3>
                 <div className="flex flex-wrap gap-2">
                  {tournament.locations.map((location, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm font-medium border border-gray-200"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/stages/tournaments/${id}`}
                className="block text-center py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                View Tournament Stages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentInfo;
