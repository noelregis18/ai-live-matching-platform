import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oesdbjqhgonbgbdsubgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc2RianFoZ29uYmdiZHN1YmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MzM3NTAsImV4cCI6MjA2NzEwOTc1MH0.AQPVuT_ypabvBTYj9Lncev3G6r6f-x99u7jRq51BNaM';

export const supabase = createClient(supabaseUrl, supabaseKey); 