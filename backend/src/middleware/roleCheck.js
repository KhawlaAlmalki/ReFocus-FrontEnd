// src/middleware/roleCheck.js

export const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

export const isAdmin = roleCheck(['admin']);
export const isCoach = roleCheck(['coach']);
export const isDeveloper = roleCheck(['developer']);
export const isCoachOrAdmin = roleCheck(['coach', 'admin']);
export const isAdminOrDeveloper = roleCheck(['admin', 'developer']);