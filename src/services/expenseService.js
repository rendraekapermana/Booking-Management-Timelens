import { supabase } from "../lib/supabase.js";

export const expenseService = {
  // 1. Ambil semua data
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  },

  // 2. Hapus data
  delete: async (id) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // 🔥 3. SIMPAN DATA BARU (CREATE)
  create: async (expenseData) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expenseData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  },

  // 🔥 4. UPDATE DATA (EDIT)
  update: async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },
};
