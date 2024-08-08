import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  "https://eotmysaufslhxvseovec.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdG15c2F1ZnNsaHh2c2VvdmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NjI2MDIsImV4cCI6MjAzODQzODYwMn0._oZyfScs4QjEQqUUDgFrSVO2V4b20_E_vDN7eUu6HXE"
);
