/**
 * This file is no longer used.
 * Google new users are now redirected to /register with { state: { googleMode: true } }
 * which reuses the existing Register flow starting at the RoleStep.
 *
 * This file can be safely deleted.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleRoleSelect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/register", { state: { googleMode: true }, replace: true });
  }, [navigate]);
  return null;
}
