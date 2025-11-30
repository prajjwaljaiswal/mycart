// Role constants
export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  ADMIN: 'admin'
}

// Helper function to check if user has a specific role
export function hasRole(userPublicMetadata, role) {
  if (!userPublicMetadata || !userPublicMetadata.role) {
    return role === ROLES.BUYER // Default role is buyer
  }
  return userPublicMetadata.role === role
}

// Helper function to check if user is a seller
export function isSeller(userPublicMetadata) {
  return hasRole(userPublicMetadata, ROLES.SELLER)
}

// Helper function to check if user is an admin
export function isAdmin(userPublicMetadata) {
  return hasRole(userPublicMetadata, ROLES.ADMIN)
}

