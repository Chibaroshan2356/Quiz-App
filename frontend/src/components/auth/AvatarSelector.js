import React from 'react';

const AvatarSelector = ({ selectedAvatar, onAvatarSelect }) => {
  // Predefined avatar options with emoji and colors
  const avatars = [
    { id: 'avatar-1', emoji: '👤', color: 'bg-blue-100', borderColor: 'border-blue-300' },
    { id: 'avatar-2', emoji: '👨', color: 'bg-green-100', borderColor: 'border-green-300' },
    { id: 'avatar-3', emoji: '👩', color: 'bg-pink-100', borderColor: 'border-pink-300' },
    { id: 'avatar-4', emoji: '🧑', color: 'bg-purple-100', borderColor: 'border-purple-300' },
    { id: 'avatar-5', emoji: '👨‍💼', color: 'bg-indigo-100', borderColor: 'border-indigo-300' },
    { id: 'avatar-6', emoji: '👩‍💼', color: 'bg-teal-100', borderColor: 'border-teal-300' },
    { id: 'avatar-7', emoji: '👨‍🎓', color: 'bg-orange-100', borderColor: 'border-orange-300' },
    { id: 'avatar-8', emoji: '👩‍🎓', color: 'bg-cyan-100', borderColor: 'border-cyan-300' },
    { id: 'avatar-9', emoji: '👨‍🚀', color: 'bg-red-100', borderColor: 'border-red-300' },
    { id: 'avatar-10', emoji: '👩‍🚀', color: 'bg-yellow-100', borderColor: 'border-yellow-300' },
    { id: 'avatar-11', emoji: '🧑‍🎨', color: 'bg-rose-100', borderColor: 'border-rose-300' },
    { id: 'avatar-12', emoji: '🧑‍🔬', color: 'bg-emerald-100', borderColor: 'border-emerald-300' }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose your avatar
      </label>
      <div className="grid grid-cols-6 gap-3">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onAvatarSelect(avatar.id)}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl
              transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
              ${selectedAvatar === avatar.id 
                ? `${avatar.color} ${avatar.borderColor} border-2 ring-2 ring-blue-500` 
                : `${avatar.color} ${avatar.borderColor} border hover:shadow-md`
              }
            `}
          >
            {avatar.emoji}
          </button>
        ))}
      </div>
      {selectedAvatar && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Selected: {avatars.find(a => a.id === selectedAvatar)?.emoji}
        </p>
      )}
    </div>
  );
};

export default AvatarSelector;
