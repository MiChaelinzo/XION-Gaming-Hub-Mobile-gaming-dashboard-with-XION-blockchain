import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Trophy, Users } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'session' | 'tournament' | 'release' | 'maintenance';
  date: Date;
  duration?: number;
  game?: string;
  participants?: number;
}

export const GamingCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Spider-Man 2 Session',
      type: 'session',
      date: new Date(2024, 0, 15, 19, 0),
      duration: 120,
      game: 'Spider-Man 2'
    },
    {
      id: '2',
      title: 'COD Tournament',
      type: 'tournament',
      date: new Date(2024, 0, 18, 20, 0),
      participants: 64,
      game: 'Call of Duty: MW3'
    },
    {
      id: '3',
      title: 'Final Fantasy VII Rebirth',
      type: 'release',
      date: new Date(2024, 1, 29),
      game: 'Final Fantasy VII Rebirth'
    },
    {
      id: '4',
      title: 'PSN Maintenance',
      type: 'maintenance',
      date: new Date(2024, 0, 22, 2, 0),
      duration: 240
    }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-blue-500';
      case 'tournament': return 'bg-purple-500';
      case 'release': return 'bg-green-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'session': return <Clock className="w-3 h-3" />;
      case 'tournament': return <Trophy className="w-3 h-3" />;
      case 'release': return <Plus className="w-3 h-3" />;
      case 'maintenance': return <Users className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Gaming Calendar</h3>
              <p className="text-gray-400 text-sm">Plan your gaming sessions and events</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          
          <h4 className="text-xl font-bold text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth('next')}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-gray-400 font-medium text-sm">
              {day}
            </div>
          ))}
          
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="p-2" />
          ))}
          
          {days.map(day => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDate(date)}
                className={`p-2 min-h-[60px] border border-gray-600 rounded-lg cursor-pointer transition-all ${
                  isSelected ? 'bg-purple-600 border-purple-500' :
                  isToday ? 'bg-blue-600/30 border-blue-500' :
                  'hover:bg-gray-700'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isSelected || isToday ? 'text-white' : 'text-gray-300'
                }`}>
                  {day}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded text-white ${getEventColor(event.type)} flex items-center space-x-1`}
                    >
                      {getEventIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-400">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-gray-700 pt-4"
          >
            <h5 className="text-white font-semibold mb-3">
              Events for {selectedDate.toLocaleDateString()}
            </h5>
            
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
                >
                  <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h6 className="text-white font-medium">{event.title}</h6>
                    <div className="text-sm text-gray-400">
                      {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.duration && ` • ${event.duration} minutes`}
                      {event.participants && ` • ${event.participants} players`}
                    </div>
                    {event.game && (
                      <div className="text-xs text-gray-500">{event.game}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-gray-400 text-center py-4">No events scheduled</p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
        
        <div className="space-y-3">
          {events.slice(0, 4).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{event.title}</h4>
                <p className="text-gray-400 text-sm">
                  {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};