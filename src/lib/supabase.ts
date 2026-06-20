import { createClient } from '@supabase/supabase-js';
import { Lead, LeadStatus } from '../types';

// Supabase environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://swjmdakqapliquwcvsiu.supabase.co';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3am1kYWtxYXBsaXF1d2N2c2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTQ0OTYsImV4cCI6MjA5NzI3MDQ5Nn0.4rBNyfU6zcEyJ_ZEtR7Vd-cH46JFZwM3FBMFaiqKMbQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const leadService = {
  /**
   * Submit a brand new lead
   */
  async submitLead(lead: Lead): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Build baseline payload that ALWAYS works on the legacy table (without new booking_ columns)
      const answersPayload = lead.answers || {
        projectType: 'Discovery Booking',
        maturity: lead.booking_date || '',
        ambition: lead.booking_time || '',
        criticalNeed: lead.booking_notes || '',
        booking_date: lead.booking_date,
        booking_time: lead.booking_time,
        booking_notes: lead.booking_notes
      };

      const basePayload: any = {
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        branch: lead.branch,
        answers: answersPayload,
        summary: lead.summary || lead.booking_notes || 'Discovery session booking',
        status: lead.status || 'Nouveau'
      };

      let data, error;
      try {
        const fullPayload = {
          ...basePayload,
          booking_date: lead.booking_date,
          booking_time: lead.booking_time,
          booking_notes: lead.booking_notes
        };

        const res = await supabase
          .from('leads')
          .insert([fullPayload])
          .select();
        data = res.data;
        error = res.error;
      } catch (insertErr: any) {
        console.warn("Table does not have explicit columns, falling back to baseColumns insert.", insertErr);
        error = insertErr;
      }

      // If we got a PG column-not-found error (42703), retry inserting using ONLY baseline columns!
      if (error && (error as any).code === '42703') {
        const retryRes = await supabase
          .from('leads')
          .insert([basePayload])
          .select();
        data = retryRes.data;
        error = retryRes.error;
      }

      if (error) {
        console.error("Supabase insertion error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data: data?.[0] };
    } catch (e: any) {
      console.error("Supabase exception during insertion:", e);
      return { success: false, error: e?.message || "Une erreur de connexion est survenue." };
    }
  },

  /**
   * Retrieve all leads (for the Admin Back-Office dashboard)
   */
  async getLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase select error:", error.message);
        throw error;
      }

      // Automatically map fallback JSON answers fields to top-level properties if they are not defined schema-side
      return (data || []).map((lead: any) => {
        const answersObj = lead.answers || {};
        return {
          ...lead,
          booking_date: lead.booking_date || answersObj.booking_date || answersObj.maturity || '',
          booking_time: lead.booking_time || answersObj.booking_time || answersObj.ambition || '',
          booking_notes: lead.booking_notes || answersObj.booking_notes || answersObj.criticalNeed || ''
        };
      });
    } catch (e) {
      console.error("Supabase query exception:", e);
      throw e;
    }
  },

  /**
   * Update the status of a lead
   */
  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error("Supabase update error:", error.message);
        return false;
      }

      return true;
    } catch (e) {
      console.error("Supabase update exception:", e);
      return false;
    }
  },

  /**
   * Delete a lead from the database
   */
  async deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Supabase delete error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      console.error("Supabase delete exception:", e);
      return { success: false, error: e?.message || "An unexpected error occurred during deletion." };
    }
  },

  /**
   * Delete all leads from the database
   */
  async deleteAllLeads(): Promise<{ success: boolean; error?: string }> {
    try {
      // Deleting rows where id is not equal to a dummy nil UUID (which matches all rows as id is always valid UUID)
      const { error } = await supabase
        .from('leads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error("Supabase delete all error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      console.error("Supabase delete all exception:", e);
      return { success: false, error: e?.message || "An unexpected error occurred during batch deletion." };
    }
  }
};

export const settingsService = {
  /**
   * Fetch a setting value by key from Supabase
   */
  async getSetting(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error) {
        console.warn("Supabase table 'settings' may not exist or is not readable yet. Graceful fallback.", error.message);
        return null;
      }
      return data?.value || null;
    } catch (e) {
      console.warn("Supabase query exception for setting key:", key, e);
      return null;
    }
  },

  /**
   * Save or update a setting value
   */
  async setSetting(key: string, value: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) {
        console.error("Supabase upsert logo setting error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase exception during setSetting:", e);
      return false;
    }
  },

  /**
   * Delete a setting value
   */
  async deleteSetting(key: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('settings')
        .delete()
        .eq('key', key);

      if (error) {
        console.error("Supabase delete logo setting error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error("Supabase exception during deleteSetting:", e);
      return false;
    }
  }
};


