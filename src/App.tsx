import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartLine, FaExchangeAlt, FaVideo, FaUsers, FaFileAlt, FaRobot, FaBell, FaChalkboardTeacher } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { Popover as HUIPopover, Transition as HUITransition } from '@headlessui/react';
import { supabase } from './supabaseClient';
import { Participant, Match, Meeting, Insight, TopMatching, Anticipation } from './types';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const menuItems = [
  { label: 'Event Management', icon: <FaCalendarAlt size={18} /> },
  { label: 'Real-Time Dashboard', icon: <FaChartLine size={18} /> },
  { label: 'Matching Tracker', icon: <FaExchangeAlt size={18} /> },
  { label: 'Meeting Monitoring', icon: <FaVideo size={18} /> },
  { label: 'Participant Management', icon: <FaUsers size={18} /> },
  { label: 'Reports', icon: <FaFileAlt size={18} /> },
  { label: 'AI Matching Settings', icon: <FaRobot size={18} /> },
];

const notifications = [
  { id: 1, message: 'New participant registered: Yeen He Eun', time: '2 min ago' },
  { id: 2, message: 'Profile updated: Kang Min Joon', time: '10 min ago' },
  { id: 3, message: 'Meeting scheduled for Yoon J Seo', time: '30 min ago' },
];

const adminEvents = [
  { id: 1, title: 'Admin Meeting', date: '2024-07-05', desc: 'Monthly admin sync-up' },
  { id: 2, title: 'System Maintenance', date: '2024-07-10', desc: 'Scheduled downtime' },
  { id: 3, title: 'Event Review', date: '2024-07-12', desc: 'Review of last event' },
];

function App() {
  const [activePage, setActivePage] = useState('Real-Time Dashboard');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [topMatching, setTopMatching] = useState<TopMatching[]>([]);
  const [anticipation, setAnticipation] = useState<Anticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: participantsData } = await supabase.from('participants').select('*');
      const { data: matchesData } = await supabase.from('matches').select('*');
      const { data: meetingsData } = await supabase.from('meetings').select('*');
      const { data: insightsData } = await supabase.from('insights').select('*');
      const { data: topMatchingData } = await supabase.from('top_matching').select('*');
      const { data: anticipationData } = await supabase.from('anticipation').select('*');
      setParticipants(participantsData || []);
      setMatches(matchesData || []);
      setMeetings(meetingsData || []);
      setInsights(insightsData || []);
      setTopMatching(topMatchingData || []);
      setAnticipation(anticipationData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Dummy data for graph (activity by time)
  const activityData = [
    { time: '09:00', login: 30, meeting: 10 },
    { time: '10:00', login: 50, meeting: 20 },
    { time: '11:00', login: 80, meeting: 30 },
    { time: '12:00', login: 120, meeting: 40 },
    { time: '13:00', login: 140, meeting: 50 },
    { time: '14:00', login: 130, meeting: 45 },
    { time: '15:00', login: 110, meeting: 35 },
    { time: '16:00', login: 90, meeting: 25 },
  ];

  // Summary stats
  const totalParticipants = participants.length || 150;
  const totalIdentified = participants.filter(p => p.is_identified).length || 29;
  const totalMatches = matches.length || 160;
  const avgSatisfaction = participants.length ? Math.round(participants.reduce((a, b) => a + b.satisfaction, 0) / participants.length) : 78;
  const totalMeetings = meetings.length || 18;
  const peak = 4.3;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-gray-200 flex flex-col z-20">
        <div className="text-xl font-bold px-6 py-8 border-b border-gray-100">Dashboard</div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {menuItems.map((item, idx) => (
              <li
                key={item.label}
                className={
                  'flex items-center gap-3 px-5 py-2.5 rounded-lg font-medium cursor-pointer transition-colors ' +
                  (activePage === item.label
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700')
                }
                onClick={() => setActivePage(item.label)}
              >
                <span className={activePage === item.label ? 'text-white' : 'text-blue-600'}>
                  {item.icon}
                </span>
                <span
                  className={
                    item.label === 'Participant Management'
                      ? 'whitespace-normal text-[0.97rem] leading-tight break-words'
                    : item.label === 'Real-Time Dashboard'
                      ? 'whitespace-normal text-[0.97rem] leading-tight break-words'
                      : 'truncate'
                  }
                  style={
                    item.label === 'Participant Management' || item.label === 'Real-Time Dashboard'
                      ? { maxWidth: '8.5rem' }
                      : {}
                  }
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 ml-56 p-8 bg-[#f8fafc] min-h-screen flex flex-col">
        <div className="flex-1">
          {activePage === 'Real-Time Dashboard' && (
            <>
              {/* Top bar with notification, admin events, and presentation button */}
              <div className="flex items-center justify-end gap-4 mb-2">
                {/* Notification Bell */}
                <HUIPopover className="relative">
                  <HUIPopover.Button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <FaBell size={20} className="text-gray-500" />
                  </HUIPopover.Button>
                  <HUITransition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <HUIPopover.Panel className="absolute right-0 z-30 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                      <div className="font-semibold mb-2">Notifications</div>
                      {notifications.length === 0 ? (
                        <div className="text-gray-400 text-sm">No notifications</div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {notifications.map((n) => (
                            <li key={n.id} className="py-2 text-sm">
                              <div className="font-medium text-gray-700">{n.message}</div>
                              <div className="text-xs text-gray-400">{n.time}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </HUIPopover.Panel>
                  </HUITransition>
                </HUIPopover>
                {/* Admin Events Button */}
                <HUIPopover className="relative">
                  <HUIPopover.Button className="flex items-center gap-2 px-4 h-10 rounded-full bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <MdEvent size={18} />
                    Admin Events
                  </HUIPopover.Button>
                  <HUITransition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <HUIPopover.Panel className="absolute right-0 z-30 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                      <div className="font-semibold mb-2">Admin Events</div>
                      {adminEvents.length === 0 ? (
                        <div className="text-gray-400 text-sm">No events</div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {adminEvents.map((e) => (
                            <li key={e.id} className="py-2 text-sm">
                              <div className="font-medium text-gray-700">{e.title}</div>
                              <div className="text-xs text-gray-400">{e.date} &mdash; {e.desc}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </HUIPopover.Panel>
                  </HUITransition>
                </HUIPopover>
              </div>
              <h1 className="text-2xl font-semibold mb-4">REAL-TIME KPI DASHBOARD</h1>
              {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Total Participants</div>
                      <div className="text-2xl font-bold">{totalParticipants}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Real-Time Identified</div>
                      <div className="text-2xl font-bold">{totalIdentified} (19%)</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Total Matches</div>
                      <div className="text-2xl font-bold">{totalMatches}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Average Satisfaction</div>
                      <div className="text-2xl font-bold">{avgSatisfaction}%</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Total Meetings</div>
                      <div className="text-2xl font-bold">{totalMeetings}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                      <div className="text-xs text-gray-400">Peak</div>
                      <div className="text-2xl font-bold">{peak}</div>
                    </div>
                  </div>

                  {/* Activity by Time Graph */}
                  <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <div className="font-semibold mb-2">Activity by Time</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="login" stroke="#6366f1" name="Participant Login" strokeWidth={2} />
                        <Line type="monotone" dataKey="meeting" stroke="#06b6d4" name="Meeting" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Real-Time Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {insights.map((insight) => (
                      <div key={insight.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex flex-col">
                        <div className="font-semibold text-sm mb-1">{insight.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div className="text-xs text-gray-700 mb-2">{insight.description}</div>
                        <a href="#" className="text-xs text-blue-600 font-medium hover:underline">{insight.action_link}</a>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Matching Top 5 */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="font-semibold mb-2">Matching in TOP 5</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700">
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-yellow-500">1.</span> Kim Minseo</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-yellow-500">2.</span> Park Jisoo</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-yellow-500">3.</span> Lee Jiwon</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-yellow-500">4.</span> Choi Yuna</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-yellow-500">5.</span> Jung Haeun</li>
                      </ol>
                    </div>
                    {/* Meeting in Anticipation */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="font-semibold mb-2">Meeting in Anticipation</div>
                      <ol className="list-decimal list-inside text-sm text-gray-700">
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-cyan-500">1.</span> Seo Joon</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-cyan-500">2.</span> Han Areum</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-cyan-500">3.</span> Moon Jiho</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-cyan-500">4.</span> Kang Minji</li>
                        <li className="mb-1 flex items-center gap-2"><span className="font-bold text-cyan-500">5.</span> Lim Sumin</li>
                      </ol>
                    </div>
                  </div>
                  {/* Real-Time Insights Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* AI Suggestions Active */}
                    <div className="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                      <span className="mt-1 text-blue-500"><FaRobot size={24} /></span>
                      <div>
                        <div className="font-semibold text-sm mb-1">AI Suggestions Active</div>
                        <div className="text-xs text-gray-700 mb-1">AI is currently suggesting matches for 12 participants.</div>
                        <HUIPopover className="relative inline-block">
                          <HUIPopover.Button className="text-xs text-blue-600 font-medium hover:underline focus:outline-none">View AI suggestions →</HUIPopover.Button>
                          <HUITransition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <HUIPopover.Panel className="absolute left-0 z-40 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                              <div className="font-semibold mb-2 text-blue-700">AI Suggestions</div>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                                <li>Kim Minseo &amp; Park Jisoo: High match probability based on 13:00 login spike.</li>
                                <li>Lee Jiwon: Suggested to join meeting at 14:00 for optimal engagement.</li>
                                <li>Choi Yuna &amp; Jung Haeun: Recommended for peer mentoring due to consistent activity.</li>
                              </ul>
                            </HUIPopover.Panel>
                          </HUITransition>
                        </HUIPopover>
                      </div>
                    </div>
                    {/* High Engagement Detected */}
                    <div className="flex items-start gap-3 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                      <span className="mt-1 text-green-500"><FaUsers size={24} /></span>
                      <div>
                        <div className="font-semibold text-sm mb-1">High Engagement Detected</div>
                        <div className="text-xs text-gray-700 mb-1">5 participants have logged in more than 3 times today.</div>
                        <HUIPopover className="relative inline-block">
                          <HUIPopover.Button className="text-xs text-green-700 font-medium hover:underline focus:outline-none">See engagement report →</HUIPopover.Button>
                          <HUITransition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <HUIPopover.Panel className="absolute left-0 z-40 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
                              <div className="font-semibold mb-2 text-green-700">Engagement Report</div>
                              <ul className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                                <li>Kim Minseo: Logged in 5 times, peak at 13:00.</li>
                                <li>Park Jisoo: Attended 3 meetings, active at 14:00.</li>
                                <li>Lee Jiwon: Consistent logins, joined all sessions.</li>
                                <li>Choi Yuna: High satisfaction, active at 15:00.</li>
                                <li>Jung Haeun: Joined peer mentoring, active at 12:00.</li>
                              </ul>
                            </HUIPopover.Panel>
                          </HUITransition>
                        </HUIPopover>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {activePage === 'Event Management' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Event Management</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Upcoming Events</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>13:00 - Peer Mentoring Session (Choi Yuna &amp; Jung Haeun)</li>
                  <li>14:00 - AI Matchmaking Demo (Lee Jiwon)</li>
                  <li>15:00 - Engagement Workshop (Kim Minseo, Park Jisoo)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Recent Event Highlights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Kim Minseo and Park Jisoo achieved a high match score during the 13:00 login spike.</li>
                  <li>Lee Jiwon joined all sessions and was highly engaged at 14:00.</li>
                  <li>Choi Yuna and Jung Haeun led the peer mentoring group.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Event Participants</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">Top Participants</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>Kim Minseo</li>
                      <li>Park Jisoo</li>
                      <li>Lee Jiwon</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Active at 13:00-15:00</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>Choi Yuna</li>
                      <li>Jung Haeun</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activePage === 'Matching Tracker' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Matching Tracker</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Recent Matches</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Kim Minseo &amp; Park Jisoo matched at 13:00 (high activity period).</li>
                  <li>Lee Jiwon matched with Choi Yuna during the 14:00 login spike.</li>
                  <li>Jung Haeun matched with Seo Joon in the afternoon session.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Top Match Scores</div>
                <table className="min-w-full text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Participant</th>
                      <th className="text-left py-1">Matched With</th>
                      <th className="text-left py-1">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Kim Minseo</td>
                      <td className="py-1">Park Jisoo</td>
                      <td className="py-1">98</td>
                    </tr>
                    <tr>
                      <td className="py-1">Lee Jiwon</td>
                      <td className="py-1">Choi Yuna</td>
                      <td className="py-1">95</td>
                    </tr>
                    <tr>
                      <td className="py-1">Jung Haeun</td>
                      <td className="py-1">Seo Joon</td>
                      <td className="py-1">93</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Matching Insights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Most matches occur between 13:00 and 15:00, aligning with graph activity peaks.</li>
                  <li>AI suggestions have increased successful matches by 20%.</li>
                  <li>Peer mentoring matches (e.g., Choi Yuna &amp; Jung Haeun) show high satisfaction.</li>
                </ul>
              </div>
            </div>
          )}
          {activePage === 'Meeting Monitoring' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Meeting Monitoring</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Live Meetings</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Peer Mentoring Session: Choi Yuna &amp; Jung Haeun (13:00-13:45)</li>
                  <li>AI Matchmaking Demo: Lee Jiwon (14:00-14:30)</li>
                  <li>Engagement Workshop: Kim Minseo, Park Jisoo (15:00-15:40)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Meeting Attendance</div>
                <table className="min-w-full text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Participant</th>
                      <th className="text-left py-1">Meetings Attended</th>
                      <th className="text-left py-1">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Kim Minseo</td>
                      <td className="py-1">3</td>
                      <td className="py-1">15:40</td>
                    </tr>
                    <tr>
                      <td className="py-1">Park Jisoo</td>
                      <td className="py-1">3</td>
                      <td className="py-1">15:40</td>
                    </tr>
                    <tr>
                      <td className="py-1">Lee Jiwon</td>
                      <td className="py-1">2</td>
                      <td className="py-1">14:30</td>
                    </tr>
                    <tr>
                      <td className="py-1">Choi Yuna</td>
                      <td className="py-1">2</td>
                      <td className="py-1">13:45</td>
                    </tr>
                    <tr>
                      <td className="py-1">Jung Haeun</td>
                      <td className="py-1">2</td>
                      <td className="py-1">13:45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Meeting Insights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Most meetings are held between 13:00 and 15:40, matching graph activity peaks.</li>
                  <li>Peer mentoring sessions have the highest attendance and satisfaction.</li>
                  <li>AI-driven meetings (e.g., matchmaking demo) show increased engagement.</li>
                </ul>
              </div>
            </div>
          )}
          {activePage === 'Participant Management' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Participant Management</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Participant List</div>
                <table className="min-w-full text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Name</th>
                      <th className="text-left py-1">Status</th>
                      <th className="text-left py-1">Last Login</th>
                      <th className="text-left py-1">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Kim Minseo</td>
                      <td className="py-1">Active</td>
                      <td className="py-1">15:00</td>
                      <td className="py-1">98%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Park Jisoo</td>
                      <td className="py-1">Active</td>
                      <td className="py-1">15:00</td>
                      <td className="py-1">95%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Lee Jiwon</td>
                      <td className="py-1">Active</td>
                      <td className="py-1">14:00</td>
                      <td className="py-1">93%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Choi Yuna</td>
                      <td className="py-1">Active</td>
                      <td className="py-1">13:00</td>
                      <td className="py-1">90%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Jung Haeun</td>
                      <td className="py-1">Active</td>
                      <td className="py-1">13:00</td>
                      <td className="py-1">89%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Participant Actions</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Send notification to participants with low satisfaction scores.</li>
                  <li>Promote peer mentoring for new joiners.</li>
                  <li>Review login activity for engagement trends.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Management Insights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Most active participants logged in during graph peak hours (13:00-15:00).</li>
                  <li>High satisfaction correlates with frequent meeting attendance.</li>
                  <li>Peer mentoring increases engagement and satisfaction.</li>
                </ul>
              </div>
            </div>
          )}
          {activePage === 'Reports' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">Reports</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Summary Report</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Peak activity observed between 13:00 and 15:00, as shown in the graph.</li>
                  <li>Kim Minseo and Park Jisoo achieved the highest match score (98) during the 13:00 spike.</li>
                  <li>AI suggestions contributed to a 20% increase in successful matches.</li>
                  <li>Peer mentoring sessions (Choi Yuna &amp; Jung Haeun) had the highest satisfaction ratings.</li>
                  <li>5 participants logged in more than 3 times today, indicating high engagement.</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Participant Report</div>
                <table className="min-w-full text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Name</th>
                      <th className="text-left py-1">Matches</th>
                      <th className="text-left py-1">Meetings</th>
                      <th className="text-left py-1">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Kim Minseo</td>
                      <td className="py-1">3</td>
                      <td className="py-1">3</td>
                      <td className="py-1">98%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Park Jisoo</td>
                      <td className="py-1">3</td>
                      <td className="py-1">3</td>
                      <td className="py-1">95%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Lee Jiwon</td>
                      <td className="py-1">2</td>
                      <td className="py-1">2</td>
                      <td className="py-1">93%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Choi Yuna</td>
                      <td className="py-1">2</td>
                      <td className="py-1">2</td>
                      <td className="py-1">90%</td>
                    </tr>
                    <tr>
                      <td className="py-1">Jung Haeun</td>
                      <td className="py-1">2</td>
                      <td className="py-1">2</td>
                      <td className="py-1">89%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Report Insights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>AI-driven features are positively impacting participant engagement and match quality.</li>
                  <li>Most successful matches and meetings occur during peak hours.</li>
                  <li>Participants with higher satisfaction scores are more active in meetings and matches.</li>
                </ul>
              </div>
            </div>
          )}
          {activePage === 'AI Matching Settings' && (
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-semibold mb-4">AI Matching Settings</h1>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Current AI Settings</div>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AI Matching Algorithm: <span className="font-semibold">SmartMatch v2.1</span></li>
                  <li>Matching Criteria: Login time, meeting attendance, satisfaction score</li>
                  <li>Peak Activity Window: 13:00 - 15:00 (based on graph data)</li>
                  <li>Peer Mentoring Boost: Enabled for Choi Yuna &amp; Jung Haeun</li>
                  <li>AI Suggestions: Active for 12 participants</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="font-semibold mb-2">Recent AI Actions</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Suggested match: Kim Minseo &amp; Park Jisoo (high probability at 13:00)</li>
                  <li>Recommended meeting: Lee Jiwon at 14:00 for engagement boost</li>
                  <li>Peer mentoring: Choi Yuna &amp; Jung Haeun paired for satisfaction improvement</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="font-semibold mb-2">Settings Insights</div>
                <ul className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>AI-driven matches have a 20% higher success rate during peak hours.</li>
                  <li>Peer mentoring increases satisfaction and engagement for new joiners.</li>
                  <li>Adjusting criteria based on login and meeting data improves match quality.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <footer className="mt-8 text-center text-xs text-gray-400">
          Designed and Developed by Noel Regis
        </footer>
      </main>
    </div>
  );
}

export default App;
