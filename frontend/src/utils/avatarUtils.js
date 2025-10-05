/**
 * Generate avatar URL using ui-avatars.com API
 * @param {string} name - User's name
 * @param {string} avatar - User's selected avatar (emoji)
 * @param {number} size - Avatar size in pixels
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (name, avatar, size = 40) => {
  try {
    // Ensure we have valid parameters
    const safeName = name || '';
    const safeAvatar = avatar || '';
    const safeSize = Math.max(16, Math.min(512, size)); // Clamp size between 16-512
    
    // If user has selected an avatar emoji, use it
    if (safeAvatar && safeAvatar.startsWith('avatar-')) {
      // Map avatar IDs to emojis
      const avatarMap = {
        'avatar-1': '👤',
        'avatar-2': '👨',
        'avatar-3': '👩',
        'avatar-4': '🧑',
        'avatar-5': '👨‍💼',
        'avatar-6': '👩‍💼',
        'avatar-7': '👨‍🎓',
        'avatar-8': '👩‍🎓',
        'avatar-9': '👨‍🚀',
        'avatar-10': '👩‍🚀',
        'avatar-11': '🧑‍🎨',
        'avatar-12': '🧑‍🔬'
      };
      
      const emoji = avatarMap[safeAvatar];
      if (emoji) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(emoji)}&size=${safeSize}&background=random&color=fff&bold=true&format=png`;
      }
    }
    
    // Fallback to user's initials
    const initials = safeName
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
      
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${safeSize}&background=random&color=fff&bold=true&format=png`;
  } catch (error) {
    console.error('Error generating avatar URL:', error);
    // Return a safe fallback
    return `https://ui-avatars.com/api/?name=U&size=${size}&background=random&color=fff&bold=true&format=png`;
  }
};

/**
 * Get user's display name (first name)
 * @param {string} name - Full name
 * @returns {string} First name
 */
export const getDisplayName = (name) => {
  try {
    if (!name || typeof name !== 'string') {
      return 'User';
    }
    const firstWord = name.trim().split(' ')[0];
    return firstWord || 'User';
  } catch (error) {
    console.error('Error getting display name:', error);
    return 'User';
  }
};
